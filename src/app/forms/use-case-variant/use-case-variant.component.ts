import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';
import {
  AttachmentDto,
  isCandidate,
  UseCaseConfiguratorService,
  UseCaseDto,
  Variant,
  VariantAttachmentCandidate,
  VariantAttachmentDto,
  VariantsForm,
} from 'src/app/shared';
import { FormDirective } from 'src/app/util';

type Attachment = VariantAttachmentCandidate | VariantAttachmentDto;

@Component({
  selector: 'app-use-case-variant',
  templateUrl: './use-case-variant.component.html',
  styleUrls: ['./use-case-variant.component.scss'],
})
export class UseCaseVariantComponent
  extends FormDirective<VariantsForm & { attachments: AttachmentDto }, UseCaseDto>
  implements OnInit
{
  private _minVariantsCount = 0;

  get numberOfVariantsCtrl() {
    return this.getControl('numberOfVariants') as FormControl;
  }

  get minVariantsCount() {
    return this._minVariantsCount;
  }

  set minVariantsCount(count: number) {
    if (this.form) {
      this.numberOfVariantsCtrl.setValidators([Validators.required, Validators.min(0)]);
      this._minVariantsCount = count;
    }
  }

  attachments: Attachment[] = [];

  constructor(protected fb: FormBuilder, private configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.configurator.register('variants', this.form);

    let { numberOfVariants } = this.configurator.getStep('detailed-request');
    if (typeof numberOfVariants !== 'number') {
      numberOfVariants = this.configurator.getStep('initial-request').numberOfVariants;
    }

    this.attachments = this.configurator
      .getAttachments()
      .filter(a => a.type === 'variant' && !isCandidate(a)) as Attachment[];

    this.form.patchValue({ attachments: [...this.attachments] });

    this.numberOfVariantsCtrl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(100), startWith(numberOfVariants || 0))
      .subscribe(
        number =>
          typeof number === 'number' && this.onChangedNumberOfVariants(Math.min(number, 1000)),
      );

    this.getControl('variants')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(variants => {
        if (variants) {
          this.minVariantsCount = Math.max(
            variants.length - this.getEmptyVariantIndices().length,
            0,
          );
          this.numberOfVariantsCtrl.setValue(variants.length, { emitEvent: false });
        }
      });
  }

  protected onChangedNumberOfVariants(number: number) {
    let variants = [...this.getControl('variants').value] as Variant[];
    const diff = number - variants.length;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        variants.push({
          name: '',
          description: '',
          identificationCriteria: { values: [] },
        });
      }
    } else {
      const emptyVariantIndices = this.getEmptyVariantIndices();
      const countToRemove = Math.min(Math.abs(diff), emptyVariantIndices.length);
      const indicesToRemove = emptyVariantIndices.splice(
        emptyVariantIndices.length - countToRemove,
      );
      this.minVariantsCount = variants.length - countToRemove;

      const newVariants = [];
      for (let i = 0; i < variants.length; i++) {
        if (indicesToRemove.indexOf(i) >= 0) {
          continue;
        }
        newVariants.push(variants[i]);
      }
      variants = [...newVariants];
    }
    this.getControl('variants').setValue(variants);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      numberOfVariants: [null, [Validators.required, Validators.min(0)]],
      variants: [[]],
      attachments: [[]],
    });
  }

  onAttachmentsChange(attachments: Attachment[]) {
    const current = this.configurator.getAttachments() || [];
    const otherAttachments = current.filter(a => a.type !== 'variant');
    this.getControl('attachments').setValue([...otherAttachments, ...attachments]);
    this.configurator.replaceAttachment('variant', attachments);
  }

  getEmptyVariantIndices() {
    const variants = [...this.getControl('variants').value] as Variant[];
    const attachments = [...this.getControl('attachments').value] as Attachment[];
    let indices = [] as number[];

    variants.forEach((variant, i) => {
      if (!variant.name && !variant.description && !variant.identificationCriteria?.values.length) {
        indices.push(i);
      }
    });
    attachments.forEach(
      attachment => (indices = indices.filter(index => index !== attachment.metadata.variantIndex)),
    );

    return indices;
  }
}
