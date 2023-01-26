import { Component, Input } from '@angular/core';
import {
  AnimatedUseCaseStep,
  USE_CASE_FORM_NAME_MAP,
  USE_CASE_STEPS_ROLES_MAP,
  UserRole,
} from 'src/app/shared';

import { stepAnimations } from './use-case-step-animations';

@Component({
  selector: 'app-use-case-step',
  templateUrl: './use-case-step.component.html',
  styleUrls: ['./use-case-step.component.scss'],
  animations: [
    stepAnimations.state,
    stepAnimations.icon,
    stepAnimations.indicator,
    stepAnimations.trailProgress,
  ],
})
export class UseCaseStepComponent {
  @Input()
  noTrail = false;

  @Input()
  step!: Required<AnimatedUseCaseStep>;

  @Input()
  error = false;

  nameMap = USE_CASE_FORM_NAME_MAP;

  getNextStepRoleLabel(step: AnimatedUseCaseStep): string {
    const res = Object.entries(USE_CASE_STEPS_ROLES_MAP).find(([, value]) =>
      value.includes(step.name),
    );
    return 'USER.' + (res ? res[0] : ('AIQX_TEAM' as UserRole));
  }
}
