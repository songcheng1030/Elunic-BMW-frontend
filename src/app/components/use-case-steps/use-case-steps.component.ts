import { Component, Input } from '@angular/core';
import { AnimatedUseCaseStep } from 'src/app/shared';
import { StepAnimationState } from 'src/app/util';

const DELAY_BETWEEN_STEPS = 550;

@Component({
  selector: 'app-use-case-steps',
  templateUrl: './use-case-steps.component.html',
  styleUrls: ['./use-case-steps.component.scss'],
})
export class UseCaseStepsComponent {
  _currentStepIndex = 0;
  _steps: AnimatedUseCaseStep[] = [];
  animationDir: 'normal' | 'reverse' = 'normal';

  @Input()
  set steps(steps: AnimatedUseCaseStep[]) {
    this._steps = this.applyAnimationMetadata(steps);
  }

  get steps() {
    return this._steps;
  }

  @Input()
  set currentStepIndex(index: number) {
    this.animationDir = this._currentStepIndex < index ? 'normal' : 'reverse';
    this._currentStepIndex = index;
    this._steps = this.applyAnimationMetadata(this.steps);
  }

  get currentStepIndex() {
    return this._currentStepIndex;
  }

  trackByName(_: number, step: AnimatedUseCaseStep): string {
    return step.name;
  }

  private applyAnimationMetadata(steps: AnimatedUseCaseStep[]): AnimatedUseCaseStep[] {
    let stepsToAnimate = 0;

    steps = steps.map((step, index) => {
      const state = steps[index - 1]?.error ? 'inactive' : this.getStepState(step, index);
      const stateChanged = state !== step.animationMetadata?.state;
      const delay = stateChanged ? DELAY_BETWEEN_STEPS * stepsToAnimate++ : 0;

      step.animationMetadata = { state, delay, stateChanged };

      return step;
    });

    if (this.animationDir === 'reverse') {
      steps.forEach(step => {
        if (step.animationMetadata?.stateChanged) {
          step.animationMetadata.delay = DELAY_BETWEEN_STEPS * --stepsToAnimate;
        }
      });
    }

    return steps;
  }

  private getStepState(step: AnimatedUseCaseStep, index: number): StepAnimationState {
    if (index < this.currentStepIndex && !!step.doneDate) {
      return 'completed';
    }
    if (index === this.currentStepIndex && step.error) {
      return 'completed';
    }

    return index === this.currentStepIndex ? 'active' : 'inactive';
  }
}
