import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormSelectOption,
  USE_CASE_FORM_NAME_MAP,
  USE_CASE_FORM_STEPS,
  USE_CASE_STATUS_MAP,
  UseCaseFormStep,
  UseCaseStatus,
} from 'src/app/shared';

interface Option extends FormSelectOption<UseCaseFormStep | UseCaseStatus> {
  type: 'step' | 'status';
}

@Component({
  selector: 'app-step-filter',
  templateUrl: './step-filter.component.html',
  styleUrls: ['./step-filter.component.scss'],
})
export class StepFilterComponent {
  @Output()
  filter = new EventEmitter<{ steps: UseCaseFormStep[]; status: UseCaseStatus[] }>();

  statusOptions: Option[] = [
    // Use the array here to keep the order.
    ...USE_CASE_FORM_STEPS.map<Option>(value => ({
      label: USE_CASE_FORM_NAME_MAP[value],
      value,
      type: 'step',
    })),
    { label: USE_CASE_STATUS_MAP['declined'], value: 'declined', type: 'status' },
  ];

  onChange(options: Option[]) {
    const steps = options.filter(o => o.type === 'step').map(o => o.value) as UseCaseFormStep[];
    const status = options.filter(o => o.type === 'status').map(o => o.value) as UseCaseStatus[];

    this.filter.next({ steps, status });
  }
}
