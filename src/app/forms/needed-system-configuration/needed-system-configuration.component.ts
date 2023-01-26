import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  NeededSystemConfigurationForm,
  ORDER_DATA_OPTS,
  TRIGGER_OPTS,
  UseCaseConfiguratorService,
  UseCaseDto,
  VALIDATION_RESULT_OPTS,
} from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-needed-system-configuration',
  templateUrl: './needed-system-configuration.component.html',
  styleUrls: ['./needed-system-configuration.component.scss'],
})
export class NeededSystemConfigurationComponent
  extends FormDirective<NeededSystemConfigurationForm, UseCaseDto>
  implements OnInit
{
  orderDataOptions = ORDER_DATA_OPTS;
  triggerOptions = TRIGGER_OPTS;
  validationResultOptions = VALIDATION_RESULT_OPTS;

  get orderData(): AbstractControl {
    return this.form.get('orderData') as AbstractControl;
  }

  get trigger(): AbstractControl {
    return this.form.get('trigger') as AbstractControl;
  }

  get validationResult(): AbstractControl {
    return this.form.get('validationResult') as AbstractControl;
  }

  constructor(protected fb: FormBuilder, private configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('system_configuration', this.form);

    Object.values(this.form.controls).forEach(control => {
      const description = control.get('description') as AbstractControl;
      if (description) {
        control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(ctrl => {
          if (ctrl.value === 'other') {
            description.setValidators(Validators.required);
            description.enable({ emitEvent: false });
          } else {
            description.clearValidators();
            description.disable({ emitEvent: false });
          }
        });
      }
    });
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      orderData: this.fb.group({
        value: [null, Validators.required],
        description: [null, Validators.required],
      }),
      trigger: this.fb.group({
        value: [null, Validators.required],
        description: [null, Validators.required],
      }),
      validationResult: this.fb.group({
        value: [null, Validators.required],
        description: [null, Validators.required],
      }),
      maxResponseTime: [null, [Validators.required, Validators.min(1)]],
    });
  }
}
