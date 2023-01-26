import { Component, Input, OnInit } from '@angular/core';
import {
  FileMetadataDto,
  FileService,
  getStepUrl,
  TestResultAttachmentDto,
  UseCaseApprovalStep,
  UseCaseConfiguratorService,
  UseCaseDto,
} from 'src/app/shared';
import { getFileSrc } from 'src/app/util';

@Component({
  selector: 'app-use-case-approval-overview',
  templateUrl: './use-case-approval-overview.component.html',
  styleUrls: ['./use-case-approval-overview.component.scss'],
})
export class UseCaseApprovalOverviewComponent implements OnInit {
  @Input()
  formStep!: Partial<UseCaseApprovalStep['form']>;

  @Input()
  useCase!: UseCaseDto;

  @Input()
  attachments: TestResultAttachmentDto[] = [];

  getStepUrl = getStepUrl;
  file?: FileMetadataDto;

  get fileUrl() {
    return this.file ? getFileSrc(this.file.id) : undefined;
  }

  constructor(public configurator: UseCaseConfiguratorService, private fileService: FileService) {}

  ngOnInit(): void {
    if (this.attachments.length) {
      this.fileService.getMetadata(this.attachments[0].refId).subscribe(f => (this.file = f));
    }
  }
}
