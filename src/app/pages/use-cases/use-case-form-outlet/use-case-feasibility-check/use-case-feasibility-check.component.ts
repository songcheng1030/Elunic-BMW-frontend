import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeasibilityForm, UseCaseConfiguratorService } from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-feasibility-check',
  templateUrl: './use-case-feasibility-check.component.html',
  styleUrls: ['./use-case-feasibility-check.component.scss'],
})
export class UseCaseFeasibilityCheckComponent
  extends FormDirective<FeasibilityForm>
  implements OnInit
{
  get feasibilityRejectTextCtrl() {
    return (this.getControl('feasibilityCheck') as FormGroup).controls['text'];
  }

  hideTextField = false;

  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('feasibility_check', this.form);

    const { feasibilityCheck } = this.configurator.getStep('initial-feasibility-check');
    if (feasibilityCheck?.value) {
      this.onFeasibilityChanged(!!feasibilityCheck.value);
    } else {
      this.onFeasibilityChanged(feasibilityCheck?.value !== false);
    }
  }

  protected buildForm() {
    return this.fb.group({
      feasibilityCheck: this.fb.group({
        value: [null, Validators.required],
        text: [null, Validators.required],
      }),
    });
  }

  onFeasibilityChanged(value: boolean) {
    if (!this.configurator.canEditSubStep('feasibility_check') && !value) {
      this.feasibilityRejectTextCtrl.disable();
      this.hideTextField = false;
    } else {
      // eslint-disable-next-line  @typescript-eslint/no-unused-expressions
      !value ? this.feasibilityRejectTextCtrl.enable() : this.feasibilityRejectTextCtrl.disable();
      this.hideTextField = value;
    }
  }
}
