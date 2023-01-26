import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import {
  AttachmentDto,
  FileService,
  Variant,
  VARIANT_IDENTIFICATION_OPTS,
  VariantAttachmentDto,
} from 'src/app/shared';
import { GalleryDirective, getImgSrc, getThumbnailSrc } from 'src/app/util';

@Component({
  selector: 'app-variants',
  templateUrl: './variants.component.html',
  styleUrls: ['./variants.component.scss'],
})
export class VariantsComponent extends GalleryDirective implements OnInit {
  @ViewChild('itemTemplate', { static: true })
  itemTemplate!: TemplateRef<unknown>;

  @Input()
  attachments: AttachmentDto[] = [];

  @Input()
  variant?: Variant;

  constructor(
    public gallery: Gallery,
    public lightbox: Lightbox,
    private fileService: FileService,
    private translate: TranslateService,
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

  isVariant(attachment: AttachmentDto): attachment is VariantAttachmentDto {
    return attachment.type === 'variant';
  }

  getIdentificationCriteriaLabel(value?: Variant['identificationCriteria']): string {
    if (!value) {
      return '';
    }
    // Legacy support
    const arr = Array.isArray(value.values) ? value.values : [];
    return arr
      .map(a => VARIANT_IDENTIFICATION_OPTS.find(el => a.includes(el.value)))
      .filter(a => a && a.value !== 'other')
      .map(a => this.translate.instant(a?.label || ''))
      .join(', ');
  }
}
