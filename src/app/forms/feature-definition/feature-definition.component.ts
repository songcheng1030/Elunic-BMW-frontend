import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FEATURE_SIZE_OPTS,
  FeatureDefinitionForm,
  POSITION_IN_VEHICLE_OPTS,
  RADIO_WITH_UNKNOWN_OPTS,
  TYPE_OF_INSPECTION_OPTS,
  UseCaseConfiguratorService,
  UseCaseDto,
} from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-feature-definition',
  templateUrl: './feature-definition.component.html',
  styleUrls: ['./feature-definition.component.scss'],
})
export class FeatureDefinitionComponent
  extends FormDirective<FeatureDefinitionForm, UseCaseDto>
  implements OnInit
{
  typeOfInspectionOptions = TYPE_OF_INSPECTION_OPTS;
  positionInVehicleOptions = POSITION_IN_VEHICLE_OPTS;
  featureSizeOptions = FEATURE_SIZE_OPTS;
  cameraIntegrationOptions = RADIO_WITH_UNKNOWN_OPTS;

  constructor(protected fb: FormBuilder, private configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.configurator.register('feature_definition', this.form);
  }

  onControlChange(
    control: 'typeOfInspection' | 'positionInVehicle',
    value: string | string[],
  ): void {
    const ctrl = this.form.get(control);
    const showOther = Array.isArray(value) ? value.includes('other') : value === 'other';

    ctrl?.setValue({ name: value, value: showOther ? '' : true });
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      cameraIntegration: [null, Validators.required],
      typeOfInspection: this.fb.group({
        name: [null, Validators.required],
        value: [true, Validators.required],
      }),
      featureSize: [null, Validators.required],
      samePositionAndOrientation: [null, Validators.required],
      cameraDistance: [null, Validators.min(0)],
      featureColor: [null, Validators.required],
      haltedOrMoving: [null, Validators.required],
      numberOfVariants: [null, [Validators.required, Validators.min(0)]],
      positionInVehicle: this.fb.group({
        name: [null, Validators.required],
        value: [true, Validators.required],
      }),
    });
  }
}
