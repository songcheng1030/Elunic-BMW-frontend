import { UseCaseFormSubStep } from './use-case-form';
import { UseCaseFormStep } from './use-case-form-object';

export interface FormStepBase {
  title: string;
  disabled?: boolean;
}

export interface FormStepControl {
  title: string;
  control: string;
  type?: string;
}

export interface FormSubStep extends FormStepBase {
  form: UseCaseFormSubStep;
  hint?: string;
}

export interface FormStep extends FormStepBase {
  form: UseCaseFormStep;
  route: string[];
  subSteps: FormSubStep[];
}

export type FormSubSteps = FormStep['subSteps'];

export interface FormStepProgress {
  done: number;
  count: number;
}

export function isFormStep(step: FormStepBase): step is FormStep {
  return 'subSteps' in step;
}

export interface FormSelectOption<T = string | boolean> {
  label: string;
  value: T;
}

export interface OtherSelectOption<T = string | boolean> {
  name: string;
  value: T;
}
