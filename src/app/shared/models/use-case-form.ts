import { StepAnimationMetadata } from 'src/app/util';

import { getCurrentStep, UseCaseDto, UseCaseStatus } from './use-case';
import { UseCaseFormStep } from './use-case-form-object';
import { UserRole } from './user';

export interface AnimatedUseCaseStep {
  name: UseCaseFormStep;
  doneBy: string;
  doneDate?: Date;
  actionRoute?: string[];
  error: boolean;
  animationMetadata?: StepAnimationMetadata;
}

export const USE_CASE_FORM_NAME_MAP: { [key in UseCaseFormStep]: string } = {
  'initial-request': 'FORMS.TITLES.INITIAL_REQUEST',
  'initial-feasibility-check': 'FORMS.TITLES.INITIAL_FEASIBILITY_CHECK',
  'detailed-request': 'FORMS.TITLES.DETAILED_REQUEST',
  offer: 'FORMS.TITLES.USE_CASE_OFFER',
  order: 'FORMS.TITLES.USE_CASE_ORDER',
  'setup-details': 'FORMS.TITLES.SETUP_DETAILS',
  implementation: 'FORMS.TITLES.IMPLEMENTATION',
  testing: 'FORMS.TITLES.TESTING',
  approval: 'FORMS.TITLES.APPROVAL',
  live: 'FORMS.TITLES.LIVE',
};

export const USE_CASE_STATUS_MAP: { [key in UseCaseStatus]: string } = {
  enabled: 'FORMS.TITLES.ENABLED',
  declined: 'FORMS.TITLES.DECLINED',
};

export function getStepLabel(useCase: UseCaseDto) {
  const step = getCurrentStep(useCase);
  return useCase.status === 'declined' ? 'USE_CASE.STATUS.DECLINED' : USE_CASE_FORM_NAME_MAP[step];
}

const USE_CASE_STEP_COLORS: Record<UseCaseFormStep, string> = {
  'initial-request': '#1a1f27',
  'initial-feasibility-check': '#1a1f27',
  'detailed-request': '#1a1f27',
  offer: '#1a1f27',
  order: '#1a1f27',
  'setup-details': '#1a1f27',
  implementation: '#1a1f27',
  testing: '#1a1f27',
  approval: '#1a1f27',
  live: '#3db014',
};

export function getStepColor(useCase: UseCaseDto) {
  const step = getCurrentStep(useCase);
  return useCase.status === 'declined' ? '#d20000' : USE_CASE_STEP_COLORS[step];
}

export const USE_CASE_STEPS_ROLES_MAP: { [key in UserRole]: UseCaseFormStep[] } = {
  AIQX_TEAM: [
    'initial-feasibility-check',
    'offer',
    'setup-details',
    'implementation',
    'testing',
    'live',
  ],
  REQUESTOR: ['initial-request', 'detailed-request', 'order', 'approval'],
};

export const SUB_STEPS_MAP: { [key in UseCaseFormStep]: UseCaseFormSubStep[] } = {
  'initial-request': ['description', 'project_planning', 'feature_definition', 'example_images'],
  'initial-feasibility-check': ['feasibility_check'],
  'detailed-request': [
    'variants',
    'camera_location',
    'infrastructure',
    'details',
    'system_configuration',
  ],
  offer: [
    'implementation_feasibility_check',
    'complexity_definition',
    'camera_position_definition',
    'estimated_price',
  ],
  order: ['order'],
  'setup-details': [
    'use_case_moniker',
    'nsi_plug',
    'ips_plc_trigger',
    'hardware_inventory',
    'hardware_setup_image',
    'output_system',
  ],
  implementation: ['implementation'],
  testing: ['testing'],
  approval: ['approval'],
  live: ['live'],
};

export type UseCaseFormSubStep =
  | 'description'
  | 'project_planning'
  | 'feature_definition'
  | 'feasibility_check'
  | 'example_images'
  | 'variants'
  | 'details'
  | 'system_configuration'
  | 'infrastructure'
  | 'implementation_feasibility_check'
  | 'complexity_definition'
  | 'camera_position_definition'
  | 'estimated_price'
  | 'camera_location'
  | 'hardware_order'
  | 'order'
  | 'hardware_details'
  | 'use_case_moniker'
  | 'nsi_plug'
  | 'ips_plc_trigger'
  | 'hardware_inventory'
  | 'hardware_setup_image'
  | 'output_system'
  | 'implementation'
  | 'testing'
  | 'approval'
  | 'live';

export const EXAMPLE_IMAGES_COUNT = 2;

export function getSubmitButtonName(step: UseCaseFormStep): string {
  if (step === 'initial-request' || step === 'detailed-request') {
    return 'ACTION.SUBMIT_REQUEST';
  } else if (step === 'initial-feasibility-check') {
    return 'ACTION.SUBMIT_FEEDBACK';
  }
  if (step === 'offer') {
    return 'ACTION.SUBMIT_OFFER';
  }
  return 'ACTION.SAVE';
}

export function getStepUrl(subStep: UseCaseFormSubStep) {
  const entry = Object.entries(SUB_STEPS_MAP).find(([, value]) => value.includes(subStep));
  return entry ? entry[0] : '';
}
