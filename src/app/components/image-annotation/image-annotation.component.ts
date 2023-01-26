import {
  AfterViewInit,
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { of, Subject } from 'rxjs';
import { catchError, filter, map, take, takeUntil } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/modals/confirm/confirm.component';
import {
  AttachmentDto,
  FileService,
  ImageAttachmentCandidate,
  ImageAttachmentDto,
  isCandidate,
  UseCaseConfiguratorService,
} from 'src/app/shared';
import { CustomImageItem, GalleryDirective, getImgSrc, getThumbnailSrc, isURL } from 'src/app/util';

type Input = ImageAttachmentCandidate & ImageAttachmentDto;

interface Annotation extends ImageAttachmentDto {
  image: string;
  file: File;
}

const IMAGE_ANNOTATION_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ImageAnnotationComponent),
  multi: true,
};

const IMAGE_ANNOTATION_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ImageAnnotationComponent),
  multi: true,
};

@Component({
  selector: 'app-image-annotation',
  templateUrl: './image-annotation.component.html',
  styleUrls: ['./image-annotation.component.scss'],
  providers: [IMAGE_ANNOTATION_CONTROL_ACCESSOR, IMAGE_ANNOTATION_VALIDATORS],
})
export class ImageAnnotationComponent
  extends GalleryDirective
  implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy
{
  // eslint-disable-next-line
  private onTouch: () => void = () => {};
  private onModelChange: (attachments: (ImageAttachmentCandidate | AttachmentDto)[]) => void =
    // eslint-disable-next-line
    () => {};
  private imagesMap = new Map<File, Promise<string | ArrayBuffer | null>>();
  private destroyed$ = new Subject<void>();
  // Used to prevent race condition.
  private updating = false;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild('itemTemplate', { static: true })
  itemTemplate!: TemplateRef<unknown>;

  form!: FormArray;
  dataSource!: MatTableDataSource<AbstractControl>;
  columnNames: string[] = ['image', 'isOK', 'description', 'createdAt', 'remove'];
  isDisabled = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private configurator: UseCaseConfiguratorService,
    private fileService: FileService,
    public dialog: MatDialog,
    public gallery: Gallery,
    public lightbox: Lightbox,
  ) {
    super(gallery, lightbox);
  }

  ngOnInit(): void {
    this.form = this.fb.array([]);

    this.dataSource = new MatTableDataSource(this.form.controls);
    this.dataSource.sortingDataAccessor = (data: AbstractControl, sortHeaderId: string) => {
      const value = data.value[sortHeaderId];
      return typeof value === 'string' ? value.toLowerCase() : value;
    };

    this.form.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        filter(() => !this.updating),
      )
      .subscribe(annotations => this.onAnnotationsChange(annotations));
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  writeValue(attachments: AttachmentDto[]): void {
    this.updateInputs(attachments.filter(a => a.type === 'image') as Input[]);
  }

  registerOnChange(fn: (attachments: (ImageAttachmentCandidate | AttachmentDto)[]) => void): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  validate(): ValidationErrors | null {
    return this.form.valid ? null : { error: true };
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    // eslint-disable-next-line  @typescript-eslint/no-unused-expressions
    isDisabled ? this.form.disable() : this.form.enable();
  }

  removeAttachment(index: number): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: this.translate.instant('MODALS.DELETE_ATTACHMENT.TITLE'),
        text: this.translate.instant('MODALS.DELETE_ATTACHMENT.BODY'),
        confirmText: this.translate.instant('MODALS.DELETE_ATTACHMENT.CONFIRM'),
        abortText: this.translate.instant('MODALS.DELETE_ATTACHMENT.ABORT'),
        showAbort: false,
      },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.form.removeAt(index);
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  private async updateInputs(inputs: Input[]): Promise<void> {
    const forms = await Promise.all(inputs.map(input => this.createAnnotation(input)));
    const imgItems = await Promise.all(inputs.map(input => this.createImgItem(input)));

    this.imgItems$.next(imgItems);

    this.updating = true;
    this.form.clear();
    forms.forEach(control => {
      this.form.push(control);
      if (this.isDisabled) {
        control.disable();
      }
    });
    this.updating = false;
    this.form.updateValueAndValidity();
    this.dataSource._updateChangeSubscription();
  }

  private onAnnotationsChange(annotations: Annotation[]): void {
    this.onTouch();
    const otherAttachments = this.configurator
      .getAttachments()
      .filter(a => a.type !== 'image') as AttachmentDto[];
    this.onModelChange([
      ...annotations.map(annotation => this.mapAnnotationToAttachment(annotation)),
      ...otherAttachments,
    ]);
    this.dataSource._updateChangeSubscription();
  }

  private async createAnnotation(input: Input): Promise<FormGroup> {
    return this.fb.group({
      id: input.id,
      file: input.file,
      type: input.type,
      metadata: this.fb.group({
        isOK: [input.metadata.isOK, Validators.required],
        description: [input.metadata.description, Validators.required],
      }),
      image: [await this.getThumbnailSrc(input.file || input.refId || (input as Annotation).image)],
      createdAt: [input.createdAt],
    });
  }

  private async createImgItem(input: Input): Promise<CustomImageItem> {
    if (input.refId) {
      return {
        src: getImgSrc(input.refId) as string,
        thumb: getThumbnailSrc(input.refId) as string,
        title$: this.fileService.getMetadata(input.refId).pipe(
          take(1),
          map(data => data.name),
          catchError(() => of('')),
        ),
      };
    }
    const img = (await this.getThumbnailSrc(input.file || input.refId)) as string | ArrayBuffer;
    return {
      src: img,
      thumb: img,
      title$: of(input.file?.name || ''),
    };
  }

  private mapAnnotationToAttachment(
    annotation: Annotation,
  ): ImageAttachmentCandidate | AttachmentDto {
    if (isCandidate(annotation)) {
      return {
        file: annotation.file,
        metadata: annotation.metadata,
        type: 'image',
      } as ImageAttachmentCandidate;
    }
    return annotation;
  }

  private async getThumbnailSrc(image: string | File) {
    if (typeof image === 'string') {
      return isURL(image) ? image : getThumbnailSrc(image);
    }

    if (!(image instanceof File)) {
      return '';
    }

    if (this.imagesMap.has(image)) {
      return this.imagesMap.get(image);
    }

    const fr = new FileReader();
    const promise = new Promise<string | ArrayBuffer | null>(res => {
      fr.onload = () => res(fr.result);
      fr.readAsDataURL(image);
    });

    this.imagesMap.set(image, promise);
    return promise;
  }
}
