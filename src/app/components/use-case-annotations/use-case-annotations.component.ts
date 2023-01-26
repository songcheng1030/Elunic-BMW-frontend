import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  AttachmentDto,
  ImageAttachmentCandidate,
  ImageAttachmentDto,
  isCandidate,
  UseCaseConfiguratorService,
  UseCaseDto,
} from 'src/app/shared';
import { FormDirective } from 'src/app/util';

type Attachment = ImageAttachmentCandidate | ImageAttachmentDto;

interface AttachmentForm {
  files: File[];
  attachments: Attachment[];
}

@Component({
  selector: 'app-use-case-annotations',
  templateUrl: './use-case-annotations.component.html',
  styleUrls: ['./use-case-annotations.component.scss'],
})
export class UseCaseAnnotationsComponent
  extends FormDirective<AttachmentForm, UseCaseDto>
  implements OnInit
{
  private attachments: AttachmentDto[] = [];
  private files: File[] = [];

  get attachmentsCtrl() {
    return this.getControl('attachments');
  }

  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('example_images', this.form);

    this.attachments = this.configurator
      .getAttachments()
      .filter(a => !isCandidate(a)) as AttachmentDto[];

    this.form.patchValue({ attachments: [...this.attachments] });

    this.attachmentsCtrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(attachments => this.onAttachmentsChanged(attachments));

    this.getControl('files')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(files => this.onFilesChanged(files));
  }

  onAttachmentsChanged(attachments: Attachment[]) {
    this.attachments = this.attachments.filter(a =>
      attachments.some(b => 'id' in b && b.id === a.id),
    ) as AttachmentDto[];
    this.files = this.files.filter(f => attachments.some(b => isCandidate(b) && b.file === f));
    this.getControl('files').setValue(this.files, { emitEvent: false });

    this.configurator.replaceAttachment('image', attachments);
  }

  onFilesChanged(files: File[]): void {
    this.files = files;
    const existing = this.attachmentsCtrl.value.filter(
      (a: AttachmentDto) => isCandidate(a) && a.type === 'image',
    ) as ImageAttachmentCandidate[];
    const added = files
      .filter(f => !existing.some(e => e.file === f))
      .map<ImageAttachmentCandidate>(file => ({
        file,
        type: 'image',
        metadata: {
          isOK: true,
          description: null,
        },
      }))
      .reverse();
    this.attachmentsCtrl.setValue([...this.attachments, ...existing, ...added]);
  }

  createExampleImagesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasOKImage = value.find((el: ImageAttachmentDto) => el.metadata.isOK === true);
      const hasNOKImage = value.find((el: ImageAttachmentDto) => el.metadata.isOK === false);

      return hasOKImage && hasNOKImage ? null : { exampleImages: true };
    };
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      attachments: [[], this.createExampleImagesValidator()],
      files: [[]],
    });
  }
}
