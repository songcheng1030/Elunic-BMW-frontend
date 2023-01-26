import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AttachmentDto, FileService, Variant, VariantAttachmentDto } from 'src/app/shared';
import { GalleryDirective, getImgSrc, getThumbnailSrc } from 'src/app/util';

@Component({
  selector: 'app-attachments-table',
  templateUrl: './attachments-table.component.html',
  styleUrls: ['./attachments-table.component.scss'],
})
export class AttachmentsTableComponent extends GalleryDirective implements OnInit {
  @ViewChild('itemTemplate', { static: true })
  itemTemplate!: TemplateRef<unknown>;

  @Input()
  attachments: AttachmentDto[] = [];

  @Input()
  variants: Variant[] = [];

  constructor(
    public gallery: Gallery,
    public lightbox: Lightbox,
    private fileService: FileService,
  ) {
    super(gallery, lightbox);
  }

  ngOnInit() {
    const items = this.attachments.map(({ refId }) => ({
      src: getImgSrc(refId) as string,
      thumb: getThumbnailSrc(refId) as string,
      title$: this.fileService.getMetadata(refId).pipe(
        take(1),
        map(data => data.name),
        catchError(() => of('')),
      ),
    }));
    this.imgItems$.next(items);
  }

  getThumbnailSrc(refId: string) {
    return getThumbnailSrc(refId);
  }

  getVariant(attachment: VariantAttachmentDto) {
    return this.variants.find((_, index) => index === attachment.metadata.variantIndex);
  }

  isVariant(attachment: AttachmentDto): attachment is VariantAttachmentDto {
    return attachment.type === 'variant';
  }
}
