import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { of } from 'rxjs';
import { catchError, filter, map, startWith, take, takeUntil } from 'rxjs/operators';
import { ConfirmComponent } from 'src/app/modals/confirm/confirm.component';
import {
  FileService,
  isCandidate,
  Variant,
  VARIANT_IDENTIFICATION_OPTS,
  VariantAttachmentCandidate,
  VariantAttachmentDto,
} from 'src/app/shared';
import { CustomImageItem, GalleryDirective, getImgSrc, getThumbnailSrc } from 'src/app/util';

type Attachment = VariantAttachmentCandidate & VariantAttachmentDto;

interface Annotation extends VariantAttachmentDto {
  image: string;
  file: File;
}

const USE_CASE_VARIANTS_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UseCaseVariantsComponent),
  multi: true,
};

const USE_CASE_VARIANTS_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UseCaseVariantsComponent),
  multi: true,
};

@Component({
  selector: 'app-use-case-variants',
  templateUrl: './use-case-variants.component.html',
  styleUrls: ['./use-case-variants.component.scss'],
  providers: [USE_CASE_VARIANTS_CONTROL_ACCESSOR, USE_CASE_VARIANTS_VALIDATORS],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UseCaseVariantsComponent
  extends GalleryDirective
  implements ControlValueAccessor, OnInit
{
  // eslint-disable-next-line
  private onTouch: () => void = () => {};
  // eslint-disable-next-line
  private onModelChange: (variants: Variant[]) => void = () => {};
  private imagesMap = new Map<File, Promise<string | ArrayBuffer | null>>();
  private _attachments: Attachment[] = [];
  // Used to prevent race condition.
  private updating = false;

  @ViewChild('itemTemplate', { static: true })
  itemTemplate!: TemplateRef<unknown>;

  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport!: CdkVirtualScrollViewport;

  isDisabled = false;
  columnNames: string[] = [
    'image',
    'variant',
    'criteria',
    'description',
    'imageCount',
    'uploadAction',
    'deleteAction',
    'expandAction',
  ];
  dataSource!: TableVirtualScrollDataSource<{ control: AbstractControl; index: number }>;
  expandedElement?: { control: AbstractControl; index: number };
  form!: FormArray;

  idCriteriaOptions = VARIANT_IDENTIFICATION_OPTS;

  @Input()
  set attachments(attachments: Attachment[]) {
    this._attachments = attachments;
  }

  get attachments() {
    return this._attachments;
  }

  @Output()
  attachmentsChange = new EventEmitter<Attachment[]>();

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private fileService: FileService,
    public dialog: MatDialog,
    public gallery: Gallery,
    public lightbox: Lightbox,
  ) {
    super(gallery, lightbox);
  }

  ngOnInit(): void {
    this.form = this.fb.array([]);
    this.dataSource = new TableVirtualScrollDataSource(
      this.form.controls.map((control, index) => ({ control, index })),
    );

    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => !this.updating),
      )
      .subscribe(variants => this.onVariantsChange(variants));
  }

  writeValue(variants: Variant[] | null): void {
    if (variants) {
      this.updateVariants(variants);
    }
  }

  registerOnChange(fn: (variants: Variant[]) => void): void {
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

  private async updateVariants(variants: Variant[]) {
    const forms = await Promise.all(variants.map((variant, i) => this.createVariant(i, variant)));
    await Promise.all(
      variants.map(async (_, i) => {
        const items = await this.createImgItemsForVariant(i);
        this.imgItems$.next({ id: this.getGalleryIdOfVariant(i), items });
      }),
    );

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
  }

  async onUpload(files: File[], variantIdx: number) {
    const variantCtrl = this.form.at(variantIdx);
    const attachmentsCtrl = variantCtrl.get('attachments') as FormArray;
    const imgItems = (await this.getImgsInGallery(this.getGalleryIdOfVariant(variantIdx))).map(
      item => item.data as CustomImageItem,
    );

    for (const file of files) {
      const attachment = {
        id: '',
        createdAt: new Date(),
        file,
        type: 'variant',
        metadata: {
          isOK: null,
          variantIndex: variantIdx,
        },
      } as Attachment;

      attachmentsCtrl.push(await this.createAttachment(attachment));
      imgItems.push(await this.createImgItem(attachment));
    }

    this.imgItems$.next({ id: this.getGalleryIdOfVariant(variantIdx), items: imgItems });
  }

  removeVariant(variantIdx: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: this.translate.instant('MODALS.DELETE_VARIANT.TITLE'),
        text: this.translate.instant('MODALS.DELETE_VARIANT.BODY'),
        confirmText: this.translate.instant('MODALS.DELETE_VARIANT.CONFIRM'),
        abortText: this.translate.instant('MODALS.DELETE_VARIANT.ABORT'),
        showAbort: false,
      },
    });

    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        this.form.removeAt(variantIdx);
        const varCount = this.form.length;
        this.destroyGallery(this.getGalleryIdOfVariant(variantIdx));
        // Reorder galleries
        const startIndex = varCount - variantIdx - 1;
        for (let i = startIndex; i < varCount; i++) {
          const oldId = this.getGalleryIdOfVariant(i + 1);
          const newId = this.getGalleryIdOfVariant(i);
          this.imgItems$.next({
            id: newId,
            items: (await this.getImgsInGallery(oldId)).map(item => item.data as CustomImageItem),
          });
        }
        this.updateDataSource();
      }
    });
  }

  removeAttachment(variantIdx: number, attachmentIdx: number) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: this.translate.instant('MODALS.DELETE_ATTACHMENT.TITLE'),
        text: this.translate.instant('MODALS.DELETE_ATTACHMENT.BODY'),
        confirmText: this.translate.instant('MODALS.DELETE_ATTACHMENT.CONFIRM'),
        abortText: this.translate.instant('MODALS.DELETE_ATTACHMENT.ABORT'),
        showAbort: false,
      },
    });

    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        const variantCtrl = this.form.at(variantIdx);
        const imagesCtrl = variantCtrl.get('attachments') as FormArray;

        imagesCtrl.removeAt(attachmentIdx);
        this.removeImgFromGallery(attachmentIdx, this.getGalleryIdOfVariant(variantIdx));
        this.updateDataSource();
      }
    });
  }

  async getThumbnailSrc(image: string | File) {
    if (typeof image === 'string') {
      return getThumbnailSrc(image);
    }
    if (!(image instanceof File)) {
      return '';
    }

    const entry = this.imagesMap.get(image);
    if (entry) {
      return entry;
    }

    const fr = new FileReader();
    const promise = new Promise<string | ArrayBuffer | null>(res => {
      fr.onload = () => res(fr.result);
      fr.readAsDataURL(image);
    });
    this.imagesMap.set(image, promise);
    return promise;
  }

  trackByIndex(i: number) {
    return i;
  }

  getGalleryIdOfVariant(variantIdx: number) {
    return `${this.galleryId}-${variantIdx}`;
  }

  showOtherInput(variantIdx: number) {
    const variantCtrl = this.form.at(variantIdx);
    const ctrl = variantCtrl.get('identificationCriteria') as FormControl;
    // Prevents errors with old variant model format.
    const values = (ctrl.value as Variant['identificationCriteria']).values;
    return (Array.isArray(values) ? values : []).includes('other');
  }

  private onVariantsChange(variants: Variant[]): void {
    this.onTouch();
    this.onModelChange(
      variants.map<Variant>(v => ({
        name: v.name,
        description: v.description,
        identificationCriteria: v.identificationCriteria,
      })),
    );

    this.attachments = (this.form.value as { attachments: Annotation[] }[]).reduce(
      (prev, curr) => [...prev, ...curr.attachments.map(a => this.mapAnnotationToAttachment(a))],
      [] as Attachment[],
    );
    this.attachmentsChange.emit(this.attachments);
    if (variants.length !== this.dataSource.data.length) {
      this.updateDataSource();
    }
  }

  private mapAnnotationToAttachment(annotation: Annotation): Attachment {
    if (isCandidate(annotation)) {
      return {
        file: annotation.file,
        metadata: annotation.metadata,
        type: 'variant',
      } as Attachment;
    }
    return annotation;
  }

  private async createVariant(index: number, variant: Variant): Promise<FormGroup> {
    const variantAttachments = this.attachments.filter(a => a.metadata.variantIndex === index);
    const group = this.fb.group({
      name: [variant.name, [Validators.required]],
      description: [variant.description, []],
      identificationCriteria: this.fb.group({
        values: [variant.identificationCriteria?.values || []],
        text: [variant.identificationCriteria?.text],
      }),
      attachments: this.fb.array(
        await Promise.all(variantAttachments.map(a => this.createAttachment(a))),
      ),
    });
    const ctrl = group.controls['identificationCriteria'] as FormGroup;

    ctrl.valueChanges
      .pipe(takeUntil(this.destroy$), startWith(ctrl.value))
      .subscribe((value: Variant['identificationCriteria']) => {
        const textCtrl = ctrl.controls['text'];
        // Prevents errors with old variant model format.
        if (Array.isArray(value.values) && value.values.includes('other')) {
          textCtrl.setValidators(Validators.required);
          textCtrl.enable({ emitEvent: false });
        } else {
          textCtrl.clearValidators();
          textCtrl.disable({ emitEvent: false });
        }
      });

    return group;
  }

  private async createAttachment(input: Attachment): Promise<FormGroup> {
    return this.fb.group({
      id: input.id,
      file: input.file,
      type: input.type,
      refId: input.refId,
      metadata: this.fb.group({
        isOK: [input.metadata.isOK, Validators.required],
        variantIndex: [input.metadata.variantIndex, Validators.required],
      }),
      image: [await this.getThumbnailSrc(input.file || input.refId)],
      createdAt: [input.createdAt],
    });
  }

  private async createImgItemsForVariant(index: number): Promise<CustomImageItem[]> {
    const variantAttachments = this.attachments.filter(a => a.metadata.variantIndex === index);
    return Promise.all(variantAttachments.map(a => this.createImgItem(a)));
  }

  private async createImgItem(input: Attachment): Promise<CustomImageItem> {
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
      title$: of(input.file.name),
    };
  }

  private updateDataSource() {
    this.dataSource = new TableVirtualScrollDataSource(
      this.form.controls.map((control, index) => ({ control, index })),
    );
  }
}
