import { FormSelectOption, OtherSelectOption } from './form';
import { UseCaseStatus } from './use-case';

export type BenefitType =
  | 'saving_manually_test'
  | 'saving_rework'
  | 'prevents_offline_rework'
  | 'specific_benefit'
  | 'other';

export type InspectionType =
  | 'correct_wrong_part'
  | 'correctly_installed_check'
  | 'exists_check'
  | 'variants_detections'
  | 'surface_check'
  | 'anomalies_check'
  | 'gap_size_check'
  | 'other';

export type FeaturePositionType = 'engine' | 'interieur' | 'exterieur' | 'wheels' | 'other';

export type RadioWithUnknown = boolean | 'unknown';

export interface BenefitForm {
  savesManualTest: {
    durationTest: number;
    testedVehicles: number;
    costRate: number;
    resultingBenefit: number;
  };
  reducingInlineRework: {
    expectedReductionInlineRework: number;
    testedVehiclesPerYear: number;
    costRate: number;
    resultingBenefit: number;
  };
  reducingOfflineRework: {
    expectedReductionOfflineRework: number;
    reworkedVehicles: number;
    costRate: number;
    resultingBenefit: number;
  };
  reducingFieldCost: {
    expectedReductionFieldCost: number;
  };
  other: {
    value: string;
  };
}

export interface DefinitionForm {
  description: string;
  costsCoveredByDepartment: string;
  benefits: BenefitForm;
  biRating: number;
  reasonOfUrgency?: string;
  inspectionFeatureAvailable: {
    value: boolean;
    productionOrPreSeries: null | 'in_production' | 'pre_series';
    partAvailableFrom: Date;
  };
}

export interface ProjectPlanning {
  targetDate: Date;

  requestorName: string;
  requestorDepartment: string;
  requestorFunction: string;
  requestorInformed: boolean;

  plannerName: string;
  plannerDepartment: string;
  plannerInformed: boolean;

  pspName: string;
  pspDepartment: string;
  pspInformed: boolean;

  qeName: string;
  qeDepartment: string;
  qeInformed: boolean;

  sectionName: string;
  sectionDepartment: string;
  sectionInformed: boolean;

  integrationOnExistingCamPossible: boolean;
  synergiesWithOtherUseCases: boolean;
}

export interface ProjectPlanningForm {
  completionDate: Date;
  requestor: ProjectPlanningGroup<OtherSelectOption>;
  planner: ProjectPlanningGroup;
  psp: ProjectPlanningGroup;
  qe: ProjectPlanningGroup;
  section: ProjectPlanningGroup;
}

export interface ProjectPlanningGroup<T = FormSelectOption> {
  name: string;
  function?: T;
  department: string;
  informed: boolean;
}

export interface FeatureDefinitionForm {
  cameraIntegration: boolean;
  typeOfInspection: {
    type: InspectionType;
    value: number | string;
  };
  featureSize: string;
  samePositionAndOrientation: boolean;
  cameraDistance: number;
  featureColor: string;
  haltedOrMoving: 'halted' | 'moving';
  numberOfVariants: number;
  positionInVehicle: {
    type: FeaturePositionType;
    value: string;
  };
}

export interface FeasibilityForm {
  feasibilityCheck: {
    value: boolean;
    text?: string;
  };
}

export type VariantIdentificationCriteria =
  | 'derivative'
  | 'part_number'
  | 'part_family'
  | 'option_code'
  | 'engine_type'
  | 'other';
export interface Variant {
  name: string;
  description: string;
  identificationCriteria: {
    values: VariantIdentificationCriteria[];
    text?: string;
  };
}

export interface VariantsForm {
  numberOfVariants: number;
  variants: Variant[];
}

export interface DetailForm {
  technicalTact: boolean;
  anonymizationNecessary: boolean;
  archivingImages: {
    value: boolean;
    months?: number;
  };
  emergencyConcept: boolean;
}

export interface ImplementationFeasibilityForm {
  implementationFeasibilityCheck: {
    value: boolean;
    text?: string;
  };
}

export interface ComplexityDefinitionForm {
  complexityForDataScience: Complexity;
  complexityForBusiness: Complexity;
  timelineForImplementation: Date;
}

export interface NumberOfTrainingImages {
  trainingImagesForOK: number;
  trainingImagesForNOK: number;
}

export interface CameraPositionDefinitionForm {
  cameraNecessary: {
    value: boolean;
    cameraHouseNecessary: string;
    definitionOfCamera: string;
    numberOfCameras: number;
    cameraPosition: {
      images: File[];
      position: string;
    };
  };
  edgeDeviceNecessary: {
    value: boolean;
    definitionOfEdgeDevice: string;
    numberOfEdgeDevices: number;
  };
  additionalLightingNecessary: {
    value: boolean;
    description: string;
  };
  hardwareCostEstimation: string;
  installationCost: string;
  numberOfPicturesTakenPerVehicle: number;
  numberOfTrainingImages: NumberOfTrainingImages[];
}

// eslint-disable-next-line
export interface EstimatedPriceForm {}

export interface UseCaseOrderForm {
  acceptNewImplementationDate: boolean;
}

export interface UseCaseTestForm {
  accepted: boolean;
}

export interface UseCaseImplementationForm {
  accepted: boolean;
}

export interface UseCaseApprovalForm {
  testDate: string;
  approved: boolean;
}

export type OrderDataValue = 'IPS-L' | 'IPS-C' | 'other' | 'unknown';
export type TriggerValue = 'IPS-I' | 'SPS/PLC' | 'V60' | 'manual' | 'other' | 'unknown';
export type ValidationResultValue = 'PTZ' | 'IPS-Q' | 'other' | 'unknown';

export interface NeededSystemConfigurationForm {
  orderData: {
    value: OrderDataValue;
    description?: string;
  };
  trigger: {
    value: TriggerValue;
    description?: string;
  };
  validationResult: {
    value: ValidationResultValue;
    description?: string;
  };
  maxResponseTime: number;
}

export interface InfrastructureForm {
  nsiSocketAvailable: RadioWithUnknown;
  powerAvailable: RadioWithUnknown;
  poeAvailable: RadioWithUnknown;
}

export interface FinalCameraLocationForm {
  mechanicalStructure: boolean;
}

export interface HardwareOrderingSetupForm {
  cameraIsCompleted: boolean;
}

export const COMPLEXITY = ['S', 'M', 'L'] as const;
export type Complexity = typeof COMPLEXITY[number];

export interface HardwareDefinitionForm {
  implementationFeasible: {
    value: boolean;
    reason: string;
  };

  complexityForDataScience: Complexity;
  complexityForBusiness: Complexity;
  timelineForImplementation: Date;
  useCasePricing: {
    currency: string;
    value: number;
  };

  definitionOfCamera: string;
  numberOfCameras: number;
  cameraPosition: {
    images: File[];
    position: string;
  };
  numberOfPicturesTakenPerVehicle: number;
  edgeDeviceNecessary: boolean;
  additionalLightingNecessary: {
    value: boolean;
    description: string;
  };
  trainingImagesForOK: number;
  trainingImagesForNOK: number;
}

export interface HardwareDetailsForm {
  ipName: string;
  ipAddress: string;
  subNetwork: string;
  gateway: string;

  cameraPartNumber: string;
  cameraInventoryNumber: string;
}

export const USE_CASE_FORM_STEPS = [
  'initial-request',
  'initial-feasibility-check',
  'detailed-request',
  'offer',
  'order',
  'setup-details',
  'implementation',
  'testing',
  'approval',
  'live',
] as const;

export type UseCaseFormStep = typeof USE_CASE_FORM_STEPS[number];

interface UseCaseStep<T extends UseCaseFormStep, R extends object> {
  type: T;
  form: Partial<R>;
  completedAt?: Date;
  createdBy?: string;
}

export type InitialRequestStep = UseCaseStep<
  'initial-request',
  DefinitionForm & ProjectPlanningForm & FeatureDefinitionForm
>;
export type InitialFeasibilityCheckStep = UseCaseStep<'initial-feasibility-check', FeasibilityForm>;
export type UseCaseApprovalStep = UseCaseStep<'approval', UseCaseApprovalForm>;
export type DetailedRequestStep = UseCaseStep<
  'detailed-request',
  VariantsForm &
    FinalCameraLocationForm &
    InfrastructureForm &
    DetailForm &
    NeededSystemConfigurationForm
>;
export type OfferStep = UseCaseStep<
  'offer',
  ImplementationFeasibilityForm & HardwareDefinitionForm & CameraPositionDefinitionForm
>;
export type OrderStep = UseCaseStep<'order', Record<string, unknown>>;

export interface EditorForm {
  content: string;
  checked: boolean;
}

export const SETUP_DETAILS_STEPS = [
  'moniker',
  'nsi',
  'ipsPlcTrigger',
  'hardwareInventory',
  'hardwareSetupImage',
  'outputSystem',
] as const;

export type SetupDetailsStepKey = typeof SETUP_DETAILS_STEPS[number];

export type SetupDetailsStep = UseCaseStep<
  'setup-details',
  Record<SetupDetailsStepKey, EditorForm>
>;

export type ImplementationStep = UseCaseStep<'implementation', object>;

export type TestingStep = UseCaseStep<'testing', object>;

export type ApprovalStep = UseCaseStep<'approval', object>;

export type LiveStep = UseCaseStep<'live', object>;

export type UseCaseStepDto =
  | InitialRequestStep
  | InitialFeasibilityCheckStep
  | DetailedRequestStep
  | OfferStep
  | OrderStep
  | SetupDetailsStep
  | ImplementationStep
  | TestingStep
  | ApprovalStep
  | LiveStep;

export type UseCaseFormStepTuple = [UseCaseFormStep, UseCaseStepDto['form']];

export interface SearchResultDto {
  id: string;
  name: string;
  plantId: string;
  plantName: string;
  status: UseCaseStatus;
  currentStep: UseCaseFormStep;
  matchingStepTypes: UseCaseFormStep[];
}
