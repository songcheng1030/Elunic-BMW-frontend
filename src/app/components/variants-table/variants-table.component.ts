import { Component, Input, OnInit } from '@angular/core';
import { AttachmentDto, Variant, VariantAttachmentDto } from 'src/app/shared';

@Component({
  selector: 'app-variants-table',
  templateUrl: './variants-table.component.html',
  styleUrls: ['./variants-table.component.scss'],
})
export class VariantsTableComponent implements OnInit {
  @Input()
  attachments: AttachmentDto[] = [];

  @Input()
  variants: Variant[] = [];

  constructor() {}

  ngOnInit() {}

  getAttachments(idx: number) {
    return this.attachments.filter(
      attachment => (attachment as VariantAttachmentDto).metadata.variantIndex === idx,
    );
  }

  isVariant(attachment: AttachmentDto): attachment is VariantAttachmentDto {
    return attachment.type === 'variant';
  }
}
