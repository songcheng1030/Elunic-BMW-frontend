import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import {
  COMPLEXITY,
  COMPLEXITY_OPTS,
  ComplexityDefinitionForm,
  ImplementationFeasibilityForm,
  UseCaseConfiguratorService,
} from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-complexity-definition',
  templateUrl: './use-case-complexity-definition.component.html',
  styleUrls: ['./use-case-complexity-definition.component.scss'],
})
export class UseCaseComplexityDefinitionComponent
  extends FormDirective<ComplexityDefinitionForm>
  implements OnInit
{
  complexityOptions = [...COMPLEXITY];
  complexityFields = COMPLEXITY_OPTS;
  completionDate: Date | null = new Date();
  showError = false;

  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('complexity_definition', this.form);

    const feasibilityCheck$ = this.configurator
      .getSubStepForm('implementation_feasibility_check')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map(
          form => !!(form as ImplementationFeasibilityForm).implementationFeasibilityCheck?.value,
        ),
        distinctUntilChanged(),
      );

    feasibilityCheck$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value =>
        value ||
        (this.configurator.isStepCompleted('offer') && this.configurator.canEditStep('offer'))
          ? this.form.enable()
          : this.form.disable(),
      );

    if (this.configurator.disabledByDecline) {
      this.form.disable();
    }

    const { completionDate } = this.configurator.getStep('initial-request');
    this.completionDate = completionDate ? new Date(completionDate) : new Date();

    this.getControl('timelineForImplementation')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(timelineForImplementation => {
        if (this.completionDate && timelineForImplementation) {
          const date1 = timelineForImplementation;
          const date2 = this.completionDate;

          if (!moment(date1).isSame(date2, 'day')) this.showError = true;
          else this.showError = false;
        }
      });
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      complexityForDataScience: [null, Validators.required],
      complexityForBusiness: [null, Validators.required],
      timelineForImplementation: [this.completionDate, Validators.required],
    });
  }
}
