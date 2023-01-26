import { Component, Input } from '@angular/core';
import {
  getStepUrl,
  InitialFeasibilityCheckStep,
  UseCaseConfiguratorService,
  UseCaseDto,
} from 'src/app/shared';

@Component({
  selector: 'app-initial-feasibility-check-overview',
  templateUrl: './initial-feasibility-check-overview.component.html',
  styleUrls: ['./initial-feasibility-check-overview.component.scss'],
})
export class InitialFeasibilityCheckOverviewComponent {
  @Input()
  formStep!: Partial<InitialFeasibilityCheckStep['form']>;

  @Input()
  useCase!: UseCaseDto;

  getStepUrl = getStepUrl;

  constructor(public configurator: UseCaseConfiguratorService) {}
}
