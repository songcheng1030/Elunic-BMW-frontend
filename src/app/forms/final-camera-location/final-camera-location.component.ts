import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pick } from 'lodash-es';
import {
  FinalCameraLocationForm,
  NO_DOT_PATTERN,
  UseCaseConfiguratorService,
  UseCaseDto,
} from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-final-camera-location',
  templateUrl: './final-camera-location.component.html',
  styleUrls: ['./final-camera-location.component.scss'],
})
export class FinalCameraLocationComponent
  extends FormDirective<FinalCameraLocationForm, UseCaseDto>
  implements OnInit
{
  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('camera_location', this.form);

    // This is needed after register() because root props might be disabled.
    if (this.configurator.canEditSubStep('camera_location')) {
      Object.values(this.selectRootControls()).forEach(ctrl => ctrl.enable());
    }
  }

  protected buildForm(): FormGroup {
    const form = this.fb.group({
      mechanicalStructure: [null, Validators.required],
    });

    // Add root prop controls to this form.
    const controls = this.selectRootControls();
    Object.entries(controls).map(([key, value]) => {
      value.setValidators([Validators.required, Validators.pattern(NO_DOT_PATTERN)]);
      form.addControl(key, value);
    });
    return form;
  }

  getMechanicalStructure() {
    return this.getControl('mechanicalStructure').value;
  }

  private selectRootControls() {
    const ctrlNames: (keyof UseCaseDto)[] = ['building', 'line', 'position'];
    const controls = this.configurator.getRootControls();
    return pick(controls, ctrlNames) as Record<string, AbstractControl>;
  }
}
