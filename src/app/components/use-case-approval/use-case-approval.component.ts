import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  FileMetadataDto,
  FileService,
  isCandidate,
  TestResultAttachmentCandidate,
  TestResultAttachmentDto,
  UseCaseApprovalForm,
  UseCaseConfiguratorService,
} from 'src/app/shared';
import { FormDirective, getFileSrc } from 'src/app/util';

@Component({
  selector: 'app-use-case-approval',
  templateUrl: './use-case-approval.component.html',
  styleUrls: ['./use-case-approval.component.scss'],
})
export class UseCaseApprovalComponent
  extends FormDirective<UseCaseApprovalForm & { files: File[] }>
  implements OnInit, OnDestroy
{
  file?: File | FileMetadataDto;
  fileUrl?: string;

  private attachment?: TestResultAttachmentCandidate | TestResultAttachmentDto;

  constructor(
    protected fb: FormBuilder,
    private configurator: UseCaseConfiguratorService,
    private fileService: FileService,
  ) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('approval', this.form);
    const filesCtrl = this.getControl('files');

    filesCtrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(files => this.onFilesChanged(files));

    this.attachment = this.configurator.getAttachments().find(a => a.type === 'test_result') as
      | TestResultAttachmentCandidate
      | TestResultAttachmentDto;

    if (this.attachment) {
      filesCtrl.clearValidators();
      this.form.updateValueAndValidity();

      if (isCandidate(this.attachment)) {
        filesCtrl.setValue([this.attachment.file]);
      } else {
        this.fileService.getMetadata(this.attachment.refId).subscribe(file => {
          filesCtrl.setValue(file);
          this.file = file;
          this.fileUrl = getFileSrc(file.id);
        });
      }
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.fileUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.fileUrl);
    }
  }

  onFilesChanged(files: File[] | FileMetadataDto): void {
    if (!Array.isArray(files)) {
      return;
    }

    this.removeAttachment();

    if (!files.length) {
      return;
    }

    const file = files.reverse()[0];
    const candidate: TestResultAttachmentCandidate = {
      file,
      type: 'test_result',
      metadata: {},
    };

    this.file = file;
    this.fileUrl = URL.createObjectURL(file);
    this.attachment = candidate;

    this.getControl('files').setValue([file], { emitEvent: false });

    this.configurator.addAttachment(candidate);
  }

  removeAttachment(): void {
    this.configurator.replaceAttachment('test_result', []);

    if (this.fileUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.fileUrl);
    }

    this.file = undefined;
    this.fileUrl = undefined;
    this.attachment = undefined;
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      testDate: [null, Validators.required],
      approved: [null, Validators.required],
      files: [[], [Validators.required, Validators.minLength(1)]],
    });
  }
}
