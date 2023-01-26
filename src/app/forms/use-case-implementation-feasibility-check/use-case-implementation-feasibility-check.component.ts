import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImplementationFeasibilityForm, UseCaseConfiguratorService } from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-implementation-feasibility-check',
  templateUrl: './use-case-implementation-feasibility-check.component.html',
  styleUrls: ['./use-case-implementation-feasibility-check.component.scss'],
})
export class UseCaseImplementationFeasibilityCheckComponent
  extends FormDirective<ImplementationFeasibilityForm>
  implements OnInit
{
  get feasibilityRejectTextCtrl() {
    return (this.getControl('implementationFeasibilityCheck') as FormGroup).controls['text'];
  }

  hideTextField = false;

  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('implementation_feasibility_check', this.form);

    const { implementationFeasibilityCheck } = this.configurator.getStep('offer');
    if (implementationFeasibilityCheck?.value) {
      this.onFeasibilityChanged(!!implementationFeasibilityCheck.value);
    } else {
      this.onFeasibilityChanged(implementationFeasibilityCheck?.value !== false);
    }
  }

  protected buildForm() {
    return this.fb.group({
      implementationFeasibilityCheck: this.fb.group({
        value: [null, Validators.required],
        text: [null, Validators.required],
      }),
    });
  }

  onFeasibilityChanged(value: boolean) {
    if (!this.configurator.canEditStep('offer') && !value) {
      this.feasibilityRejectTextCtrl.disable();
      this.hideTextField = false;
    } else {
      // eslint-disable-next-line  @typescript-eslint/no-unused-expressions
      !value ? this.feasibilityRejectTextCtrl.enable() : this.feasibilityRejectTextCtrl.disable();
      this.hideTextField = value;
    }
  }
}
