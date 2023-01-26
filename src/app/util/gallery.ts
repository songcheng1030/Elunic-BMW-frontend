import { AfterViewInit, Directive, OnDestroy, TemplateRef } from '@angular/core';
import { Gallery, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

export interface CustomImageItem {
  src: string | ArrayBuffer;
  thumb: string | ArrayBuffer;
  title$: Observable<string>;
}

let i = 1;

@Directive()
export abstract class GalleryDirective implements AfterViewInit, OnDestroy {
  protected destroy$ = new Subject<void>();

  abstract itemTemplate?: TemplateRef<unknown>;

  galleryId = `gallery-${i++}`;

  imgItems$ = new BehaviorSubject<CustomImageItem[] | { id: string; items: CustomImageItem[] }>([]);

  constructor(public gallery: Gallery, public lightbox: Lightbox) {}

  ngAfterViewInit(): void {
    this.imgItems$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      const id = Array.isArray(items) ? this.galleryId : items.id;
      const lightboxRef = this.gallery.ref(id);
      lightboxRef.setConfig({
        imageSize: ImageSize.Cover,
        thumbPosition: ThumbnailsPosition.Top,
        itemTemplate: this.itemTemplate,
      });
      lightboxRef.reset();

      const arr = Array.isArray(items) ? items : items.items;
      arr.forEach(item => lightboxRef.addImage(item));
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.gallery.destroyAll();
  }

  async getImgsInGallery(id = this.galleryId) {
    const state = await this.gallery.ref(id).state.pipe(take(1)).toPromise();
    return (state && state.items) || [];
  }

  removeImgFromGallery(index: number, id = this.galleryId) {
    this.gallery.ref(id).remove(index);
  }

  destroyGallery(id = this.galleryId) {
    this.gallery.ref(id).destroy();
  }
}
