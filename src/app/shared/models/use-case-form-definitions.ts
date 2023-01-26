import { FormSelectOption } from './form';
import {
  BenefitForm,
  OrderDataValue,
  RadioWithUnknown,
  TriggerValue,
  ValidationResultValue,
  VariantIdentificationCriteria,
} from './use-case-form-object';

export const TYPE_OF_INSPECTION_OPTS: FormSelectOption[] = [
  { label: 'FORMS.FEATURE_DEFINITION.CHECK_IF_INSTALLED', value: 'check if correctly installed' },
  { label: 'FORMS.FEATURE_DEFINITION.CHECK_FOR_EXISTENCE', value: 'check for existence' },
  { label: 'FORMS.FEATURE_DEFINITION.DETECTION_OF_VARIANTS', value: 'detection of variants' },
  { label: 'FORMS.FEATURE_DEFINITION.SURFACE_CHECK', value: 'surface check' },
  { label: 'FORMS.FEATURE_DEFINITION.CHECK_FOR_ANOMALIES', value: 'check for anomalies' },
  { label: 'FORMS.FEATURE_DEFINITION.GAP_SIZE_CHECK', value: 'gap size check' },
  { label: 'FORMS.FEATURE_DEFINITION.OTHER', value: 'other' },
];

export const POSITION_IN_VEHICLE_OPTS: FormSelectOption[] = [
  { label: 'FORMS.FEATURE_DEFINITION.ENGINE_AREA', value: 'engine' },
  { label: 'FORMS.FEATURE_DEFINITION.INTERIEUR', value: 'interieur' },
  { label: 'FORMS.FEATURE_DEFINITION.EXTERIEUR', value: 'exterieur' },
  { label: 'FORMS.FEATURE_DEFINITION.WHEELS', value: 'wheels' },
  { label: 'FORMS.FEATURE_DEFINITION.OTHER', value: 'other' },
];

export const FEATURE_SIZE_OPTS: FormSelectOption[] = [
  { label: '0-2', value: '0-2' },
  { label: '2-5', value: '2-5' },
  { label: '5-15', value: '5-15' },
  { label: '>15', value: '>15' },
];

export const RADIO_WITH_UNKNOWN_OPTS: FormSelectOption<RadioWithUnknown>[] = [
  { label: 'LABEL.YES', value: true },
  { label: 'LABEL.NO', value: false },
  { label: 'LABEL.UNKNOWN', value: 'unknown' },
];

export const ORDER_DATA_OPTS: FormSelectOption<OrderDataValue>[] = [
  { label: 'FORMS.SYSTEM_CONFIGURATION.IPS_L', value: 'IPS-L' },
  { label: 'FORMS.SYSTEM_CONFIGURATION.IPS_C', value: 'IPS-C' },
  { label: 'FORMS.SYSTEM_CONFIGURATION.OTHER', value: 'other' },
  { label: 'LABEL.UNKNOWN', value: 'unknown' },
];

export const TRIGGER_OPTS: FormSelectOption<TriggerValue>[] = [
  { label: 'FORMS.SYSTEM_CONFIGURATION.IPS_I', value: 'IPS-I' },
  { label: 'FORMS.SYSTEM_CONFIGURATION.SPS_PLC', value: 'SPS/PLC' },
  { label: 'FORMS.SYSTEM_CONFIGURATION.V60', value: 'V60' },
  { label: 'FORMS.SYSTEM_CONFIGURATION.MANUAL_SWITCH', value: 'manual' },
  { label: 'FORMS.SYSTEM_CONFIGURATION.OTHER', value: 'other' },
  { label: 'LABEL.UNKNOWN', value: 'unknown' },
];
export const VALIDATION_RESULT_OPTS: FormSelectOption<ValidationResultValue>[] = [
  { label: 'FORMS.SYSTEM_CONFIGURATION.IPS_Q', value: 'IPS-Q' },
  { label: 'FORMS.SYSTEM_CONFIGURATION.PTZ', value: 'PTZ' },
  { label: 'FORMS.SYSTEM_CONFIGURATION.OTHER', value: 'other' },
  { label: 'LABEL.UNKNOWN', value: 'unknown' },
];

export const VARIANT_IDENTIFICATION_OPTS: FormSelectOption<VariantIdentificationCriteria>[] = [
  { label: 'FORMS.VARIANTS.DERIVATIVE', value: 'derivative' },
  { label: 'FORMS.VARIANTS.PART_NUMBER', value: 'part_number' },
  { label: 'FORMS.VARIANTS.PART_FAMILY', value: 'part_family' },
  { label: 'FORMS.VARIANTS.OPTION_CODE', value: 'option_code' },
  { label: 'FORMS.VARIANTS.ENGINE_TYPE', value: 'engine_type' },
  { label: 'FORMS.VARIANTS.OTHER', value: 'other' },
];

interface PlanningGroup {
  title: string;
  control: string;
  required: boolean;
  functionOptions?: FormSelectOption[];
  requireInformed: boolean;
}

export type ProjectFunction =
  | 'Plant planner'
  | 'QE'
  | 'PSP'
  | 'Process planner'
  | 'Section'
  | 'Implementation owner'
  | 'other';

export const PROJECT_PLANNING_REQUESTOR_FUNCTION_OPTIONS: FormSelectOption<ProjectFunction>[] = [
  { label: 'FORMS.PROJECT_PLANNING.PLANT_PLANNER', value: 'Plant planner' },
  { label: 'FORMS.PROJECT_PLANNING.QE', value: 'QE' },
  { label: 'FORMS.PROJECT_PLANNING.PSP', value: 'PSP' },
  { label: 'FORMS.PROJECT_PLANNING.PROCESS_PLANNER', value: 'Process planner' },
  { label: 'FORMS.PROJECT_PLANNING.SECTION', value: 'Section' },
  { label: 'FORMS.PROJECT_PLANNING.IMPLEMENTATION_OWNER', value: 'Implementation owner' },
  { label: 'FORMS.PROJECT_PLANNING.OTHER', value: 'other' },
];

export const PROJECT_PLANNING_GROUPS: PlanningGroup[] = [
  {
    title: 'FORMS.PROJECT_PLANNING.REQUESTOR',
    control: 'requestor',
    required: true,
    functionOptions: [...PROJECT_PLANNING_REQUESTOR_FUNCTION_OPTIONS],
    requireInformed: false,
  },
  {
    title: 'FORMS.PROJECT_PLANNING.PROCESS_OR_PLANT_PLANNER',
    control: 'planner',
    required: false,
    requireInformed: true,
  },
  { title: 'FORMS.PROJECT_PLANNING.PSP', control: 'psp', required: false, requireInformed: true },
  { title: 'FORMS.PROJECT_PLANNING.QE', control: 'qe', required: false, requireInformed: true },
  {
    title: 'FORMS.PROJECT_PLANNING.SECTION',
    control: 'section',
    required: false,
    requireInformed: true,
  },
];

export const COMPLEXITY_OPTS = [
  {
    label: 'FORMS.USE_CASE_OFFER.COMPLEXITY_FOR_DATA_SCIENCE',
    control: 'complexityForDataScience',
  },
  {
    label: 'FORMS.USE_CASE_OFFER.COMPLEXITY_FOR_PLATFORM',
    control: 'complexityForBusiness',
  },
];

export const PART_AVAILABILITY_OPTS: FormSelectOption[] = [
  { label: 'FORMS.DESCRIPTION.ALREADY_IN_PRODUCTION', value: 'in_production' },
  { label: 'FORMS.DESCRIPTION.IN_RUNNING_PRE_SERIES', value: 'pre_series' },
];

export const DESC_MAX_LENGTH = 500;

type Benefits = {
  [key in keyof BenefitForm]: {
    label: string;
    tooltip?: string;
    subfields: {
      label: string;
      tooltip?: string;
      type?: string;
      name: string;
    }[];
  };
};
export const BENEFITS_OPTS: Benefits = {
  savesManualTest: {
    label: 'FORMS.DESCRIPTION.BENEFITS.SAVING_MANUAL_TEST',
    tooltip: 'FORMS.DESCRIPTION.BENEFITS.SAVING_MANUAL_TEST_TOOLTIP',
    subfields: [
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.DURATION_TEST',
        tooltip: 'FORMS.DESCRIPTION.BENEFITS.DURATION_TEST_TOOLTIP',
        type: 'number',
        name: 'durationTest',
      },
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.TESTED_VEHICLES_PER_YEAR',
        tooltip: 'FORMS.DESCRIPTION.BENEFITS.TESTED_VEHICLES_PER_YEAR_TOOLTIP',
        type: 'int',
        name: 'testedVehicles',
      },
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.COST_RATE',
        tooltip: 'FORMS.DESCRIPTION.BENEFITS.COST_RATE_TOOLTIP',
        type: 'number',
        name: 'costRate',
      },
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.RESULTING_BENEFIT',
        type: 'number',
        name: 'resultingBenefit',
      },
    ],
  },
  reducingInlineRework: {
    label: 'FORMS.DESCRIPTION.BENEFITS.REDUCING_INLINE_REWORK',
    tooltip: 'FORMS.DESCRIPTION.BENEFITS.REDUCING_INLINE_REWORK_TOOLTIP',
    subfields: [
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.EXPECTED_REDUCTION_INLINE_REWORK',
        type: 'number',
        name: 'expectedReductionInlineRework',
      },
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.REWORKED_VEHICLES_PER_YEAR',
        type: 'int',
        name: 'testedVehiclesPerYear',
      },
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.COST_RATE',
        type: 'number',
        name: 'costRate',
      },
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.RESULTING_BENEFIT',
        type: 'number',
        name: 'resultingBenefit',
      },
    ],
  },
  reducingOfflineRework: {
    label: 'FORMS.DESCRIPTION.BENEFITS.REDUCING_OFFLINE_REWORK',
    tooltip: 'FORMS.DESCRIPTION.BENEFITS.REDUCING_OFFLINE_REWORK_TOOLTIP',
    subfields: [
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.EXPECTED_REDUCTION_OFFLINE_REWORK',
        type: 'number',
        name: 'expectedReductionOfflineRework',
      },
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.REWORKED_VEHICLES_PER_YEAR',
        type: 'int',
        name: 'reworkedVehicles',
      },
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.COST_RATE',
        type: 'number',
        name: 'costRate',
      },
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.RESULTING_BENEFIT',
        type: 'number',
        name: 'resultingBenefit',
      },
    ],
  },
  reducingFieldCost: {
    label: 'FORMS.DESCRIPTION.BENEFITS.REDUCING_FIELD_COST',
    tooltip: 'FORMS.DESCRIPTION.BENEFITS.REDUCING_FIELD_COST_TOOLTIP',
    subfields: [
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.EXPECTED_REDUCTION_FIELD_COST',
        type: 'number',
        name: 'expectedReductionFieldCost',
      },
    ],
  },
  other: {
    label: 'FORMS.DESCRIPTION.BENEFITS.OTHER',
    subfields: [
      {
        label: 'FORMS.DESCRIPTION.BENEFITS.OTHER',
        type: 'text',
        name: 'value',
      },
    ],
  },
};
