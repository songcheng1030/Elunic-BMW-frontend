import { FormStep, FormSubSteps } from './form';
import { USE_CASE_FORM_NAME_MAP } from './use-case-form';

export const INITIAL_REQUEST_TABS: FormSubSteps = [
  {
    title: 'FORMS.TITLES.DESCRIPTION',
    form: 'description',
  },
  {
    title: 'FORMS.TITLES.PROJECT_PLANNING',
    form: 'project_planning',
  },
  {
    title: 'FORMS.TITLES.FEATURE_DEFINITION',
    form: 'feature_definition',
  },
  {
    title: 'FORMS.TITLES.EXAMPLE_IMAGES',
    form: 'example_images',
    hint: 'FORMS.EXAMPLE_IMAGES.TOOLTIP',
  },
];
export const DETAILED_REQUEST_TABS: FormSubSteps = [
  {
    title: 'FORMS.TITLES.VARIANT',
    form: 'variants',
  },
  {
    title: 'FORMS.TITLES.CAMERA_LOCATION',
    form: 'camera_location',
  },
  {
    title: 'FORMS.TITLES.INFRASTRUCTURE',
    form: 'infrastructure',
  },
  {
    title: 'FORMS.TITLES.DETAILS',
    form: 'details',
  },
  {
    title: 'FORMS.TITLES.SYSTEM_CONFIGURATION',
    form: 'system_configuration',
  },
];
export const OFFER_TABS: FormSubSteps = [
  {
    title: 'FORMS.TITLES.FEASIBILITY_CHECK',
    form: 'implementation_feasibility_check',
  },
  {
    title: 'FORMS.TITLES.COMPLEXITY_DEFINITION',
    form: 'complexity_definition',
  },
  {
    title: 'FORMS.TITLES.HARDWARE_COST_DEFINITION',
    form: 'camera_position_definition',
  },
  {
    title: 'FORMS.TITLES.ESTIMATED_PRICE',
    form: 'estimated_price',
  },
];
export const ORDER_TABS: FormSubSteps = [
  {
    title: 'FORMS.TITLES.USE_CASE_ORDER_SUB',
    form: 'order',
  },
];
export const FEASIBILITY_TABS: FormSubSteps = [
  {
    title: 'FORMS.TITLES.FEASIBILITY_CHECK',
    form: 'feasibility_check',
  },
];
export const SETUP_DETAILS_TABS: FormSubSteps = [
  {
    title: 'FORMS.TITLES.USE_CASE_MONIKER',
    form: 'use_case_moniker',
  },
  {
    title: 'FORMS.TITLES.NSI_PLUG',
    form: 'nsi_plug',
  },
  {
    title: 'FORMS.TITLES.IPS_PLC_TRIGGER',
    form: 'ips_plc_trigger',
  },
  {
    title: 'FORMS.TITLES.HARDWARE_INVENTORY',
    form: 'hardware_inventory',
  },
  {
    title: 'FORMS.TITLES.HARDWARE_SETUP_IMAGE',
    form: 'hardware_setup_image',
  },
  {
    title: 'FORMS.TITLES.OUTPUT_SYSTEM',
    form: 'output_system',
  },
];

export const STEPS: FormStep[] = [
  {
    title: USE_CASE_FORM_NAME_MAP['initial-request'],
    form: 'initial-request',
    route: ['/use-cases', 'edit'],
    subSteps: INITIAL_REQUEST_TABS,
  },
  {
    title: USE_CASE_FORM_NAME_MAP['initial-feasibility-check'],
    form: 'initial-feasibility-check',
    route: ['/use-cases', 'edit', 'initial-feasibility-check'],
    subSteps: FEASIBILITY_TABS,
  },
  {
    title: USE_CASE_FORM_NAME_MAP['detailed-request'],
    form: 'detailed-request',
    route: ['/use-cases', 'edit', 'detailed-request'],
    subSteps: DETAILED_REQUEST_TABS,
  },
  {
    title: USE_CASE_FORM_NAME_MAP['offer'],
    form: 'offer',
    route: ['/use-cases', 'edit', 'offer'],
    subSteps: OFFER_TABS,
  },
  {
    title: USE_CASE_FORM_NAME_MAP['order'],
    form: 'order',
    route: ['/use-cases', 'edit', 'order'],
    subSteps: ORDER_TABS,
  },
  {
    title: USE_CASE_FORM_NAME_MAP['setup-details'],
    form: 'setup-details',
    route: ['/use-cases', 'edit', 'setup-details'],
    subSteps: SETUP_DETAILS_TABS,
  },
  {
    title: USE_CASE_FORM_NAME_MAP['implementation'],
    form: 'implementation',
    route: ['/use-cases', 'edit', 'implementation'],
    subSteps: [],
  },
  {
    title: USE_CASE_FORM_NAME_MAP['testing'],
    form: 'testing',
    route: ['/use-cases', 'edit', 'testing'],
    subSteps: [],
  },
  {
    title: USE_CASE_FORM_NAME_MAP['approval'],
    form: 'approval',
    route: ['/use-cases', 'edit', 'approval'],
    subSteps: [],
  },
  {
    title: USE_CASE_FORM_NAME_MAP['live'],
    form: 'live',
    route: ['/use-cases', 'edit', 'live'],
    subSteps: [],
  },
];
