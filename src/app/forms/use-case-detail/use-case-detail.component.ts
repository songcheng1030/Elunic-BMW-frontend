import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetailForm, UseCaseConfiguratorService, UseCaseDto } from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-detail',
  templateUrl: './use-case-detail.component.html',
  styleUrls: ['./use-case-detail.component.scss'],
})
export class UseCaseDetailComponent
  extends FormDirective<DetailForm, UseCaseDto>
  implements OnInit
{
  get archivingImagesCtrl() {
    return this.getControl('archivingImages');
  }

  constructor(protected fb: FormBuilder, private configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();
    const ctrl = this.getControl('archivingImages') as FormGroup;
    this.onArchivingImagesChange(!!ctrl.getRawValue().value);
    this.configurator.register('details', this.form);

    const valueCtrl = ctrl.controls['value'];
    this.onArchivingImagesChange(valueCtrl.value);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      technicalTact: [null, Validators.required],
      anonymizationNecessary: [null, Validators.required],
      archivingImages: this.fb.group({
        value: [null, Validators.required],
        months: [null, [Validators.required, Validators.min(1)]],
      }),
      emergencyConcept: [false, Validators.requiredTrue],
    });
  }

  onArchivingImagesChange(value: boolean) {
    const ctrl = (this.getControl('archivingImages') as FormGroup).controls['months'];
    // eslint-disable-next-line  @typescript-eslint/no-unused-expressions
    value ? ctrl?.enable() : ctrl?.disable();
  }
}
