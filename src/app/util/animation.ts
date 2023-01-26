export interface StepAnimationMetadata {
  delay: number;
  state: StepAnimationState;
  stateChanged: boolean;
}

export type StepAnimationState = 'void' | 'inactive' | 'active' | 'completed';
