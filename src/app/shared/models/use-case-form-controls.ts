import { FormStepControl } from './form';

export const DESCRIPTION_CONTROLS: FormStepControl[] = [
  { title: 'FORMS.DESCRIPTION.INSPECTION_FEATURE', control: 'name' },
  { title: 'FORMS.DESCRIPTION.INSPECTION_DESCRIPTION', control: 'form.description' },
  { title: 'FORMS.DESCRIPTION.COSTS_FOR_USE_CASE', control: 'form.costsCoveredByDepartment' },
  { title: 'FORMS.DESCRIPTION.PLANT', control: 'plantId' },
  { title: 'FORMS.DESCRIPTION.BUILDING_NUMBER', control: 'building' },
  { title: 'FORMS.DESCRIPTION.LINE_NUMBER', control: 'line' },
  { title: 'FORMS.DESCRIPTION.TACT_PILLAR_POSITION', control: 'position' },
  {
    title: 'FORMS.DESCRIPTION.INSPECTION_FEATURE_AVAILABLE',
    control: 'form.inspectionFeatureAvailable',
  },
  { title: 'FORMS.DESCRIPTION.BENEFITS_LABEL', control: 'form.benefits' },
  { title: 'FORMS.DESCRIPTION.BI_RATING', control: 'form.biRating' },
  { title: 'FORMS.DESCRIPTION.REASON_OF_URGENCY', control: 'form.reasonOfUrgency' },
];

export const PROJECT_PLANNING_CONTROLS: FormStepControl[] = [
  {
    title: 'FORMS.PROJECT_PLANNING.COMPLETION_DATE',
    control: 'form.completionDate',
    type: 'datetime',
  },
  { title: 'FORMS.PROJECT_PLANNING.REQUESTOR', control: 'form.requestor' },
  { title: 'FORMS.PROJECT_PLANNING.PROCESS_OR_PLANT_PLANNER', control: 'form.planner' },
  { title: 'FORMS.PROJECT_PLANNING.PSP', control: 'form.psp' },
  { title: 'FORMS.PROJECT_PLANNING.QE', control: 'form.qe' },
  { title: 'FORMS.PROJECT_PLANNING.SECTION', control: 'form.section' },
  { title: 'FORMS.PROJECT_PLANNING.CAMERA_INTEGRATION', control: 'form.cameraIntegration' },
];

export const FEATURE_DEFINITION_CONTROLS: FormStepControl[] = [
  { title: 'FORMS.FEATURE_DEFINITION.TYPE_OF_INSPECTION', control: 'form.typeOfInspection' },
  { title: 'FORMS.FEATURE_DEFINITION.FEATURE_SIZE', control: 'form.featureSize' },
  {
    title: 'FORMS.FEATURE_DEFINITION.POSITION_AND_ORIENTATION_ALWAYS_THE_SAME',
    control: 'form.samePositionAndOrientation',
  },
  { title: 'FORMS.FEATURE_DEFINITION.CAMERA_DISTANCE_CM', control: 'form.cameraDistance' },
  { title: 'FORMS.FEATURE_DEFINITION.FEATURE_COLOR_CHANGING', control: 'form.featureColor' },
  { title: 'FORMS.FEATURE_DEFINITION.FEATURE_HALTED_OR_MOVING', control: 'form.haltedOrMoving' },
  { title: 'FORMS.FEATURE_DEFINITION.POSITION_IN_VEHICLE', control: 'form.positionInVehicle' },
  { title: 'FORMS.FEATURE_DEFINITION.NUMBER_OF_VARIANTS', control: 'form.numberOfVariants' },
];

export const FEASIBILITY_CONTROLS: FormStepControl[] = [
  {
    title: 'FORMS.FEASIBILITY_CHECK.USE_CASE_FEASIBLE',
    control: 'form.feasibilityCheck.value',
  },
];

export const IMPLEMENTATION_FEASIBILITY_CONTROLS: FormStepControl[] = [
  {
    title: 'FORMS.IMPLEMENTATION_FEASIBILITY_CHECK.USE_CASE_FEASIBLE',
    control: 'form.implementationFeasibilityCheck.value',
  },
];

export const VARIANTS_CONTROLS: FormStepControl[] = [
  { title: 'FORMS.VARIANTS.NUMBER_OF_VARIANTS', control: 'form.numberOfVariants' },
];

export const DETAILS_CONTROLS: FormStepControl[] = [
  { title: 'FORMS.VARIANTS.TECHNICAL_TACT', control: 'form.technicalTact' },
  { title: 'FORMS.VARIANTS.ANONYMIZATION_NECESSARY', control: 'form.anonymizationNecessary' },
  { title: 'FORMS.VARIANTS.ARCHIVING_IMAGES', control: 'form.archivingImages' },
  { title: 'FORMS.VARIANTS.EMERGENCY_CONCEPT', control: 'form.emergencyConcept' },
];

export const SYSTEM_CONFIGURATION_CONTROLS: FormStepControl[] = [
  { title: 'FORMS.VARIANTS.ORDER_DATA', control: 'form.orderData.value' },
  { title: 'FORMS.VARIANTS.TRIGGER', control: 'form.trigger.value' },
  { title: 'FORMS.VARIANTS.VALIDATION_RESULT', control: 'form.validationResult.value' },
];

export const CAMERA_LOCATION_CONTROLS: FormStepControl[] = [
  { title: 'FORMS.CAMERA_LOCATION.PLANT', control: 'plantId' },
  { title: 'FORMS.CAMERA_LOCATION.BUILDING', control: 'building' },
  { title: 'FORMS.CAMERA_LOCATION.LINE', control: 'line' },
  { title: 'FORMS.CAMERA_LOCATION.TACT', control: 'position' },
  {
    title: 'FORMS.CAMERA_LOCATION.MECHANICAL_STRUCTURE_FOR_CAMERA',
    control: 'form.mechanicalStructure',
  },
];

export const COMPLEXITY_DEFINITION_CONTROLS: FormStepControl[] = [
  {
    title: 'FORMS.USE_CASE_OFFER.COMPLEXITY_FOR_DATA_SCIENCE',
    control: 'form.complexityForDataScience',
  },
  {
    title: 'FORMS.USE_CASE_OFFER.COMPLEXITY_FOR_PLATFORM',
    control: 'form.complexityForBusiness',
  },
  {
    title: 'FORMS.USE_CASE_OFFER.TIMELINE_FOR_IMPLEMENTATION',
    control: 'form.timelineForImplementation',
    type: 'datetime',
  },
];

export const HARDWARE_COST_DEFINITION_CONTROLS: FormStepControl[] = [
  {
    title: 'FORMS.USE_CASE_OFFER.CAMERA_NECESSARY',
    control: 'form.cameraNecessary',
  },
  {
    title: 'FORMS.USE_CASE_OFFER.CAMERA_HOUSE_NECESSARY',
    control: 'form.cameraHouseNecessary',
  },
  { title: 'FORMS.USE_CASE_OFFER.DEFINITION_OF_CAMERA', control: 'form.definitionOfCamera' },
  { title: 'FORMS.USE_CASE_OFFER.NUMBER_OF_CAMERAS', control: 'form.numberOfCameras' },
  { title: 'FORMS.USE_CASE_OFFER.CAMERA_POSITION', control: 'form.cameraPosition' },
  {
    title: 'FORMS.USE_CASE_OFFER.EDGE_DEVICE_NECESSARY',
    control: 'form.edgeDeviceNecessary',
  },
  {
    title: 'FORMS.USE_CASE_OFFER.NUMBER_EDGE_DEVICE_NECESSARY',
    control: 'form.numberOfEdgeDevices',
  },
  {
    title: 'FORMS.USE_CASE_OFFER.ADDITIONAL_LIGHTING_NECESSARY',
    control: 'form.additionalLightingNecessary',
  },
  {
    title: 'FORMS.USE_CASE_OFFER.HARDWARE_COST_ESTIMATION',
    control: 'form.hardwareCostEstimation',
  },
  { title: 'FORMS.USE_CASE_OFFER.INSTALLATION_COST', control: 'form.installationCost' },
  {
    title: 'FORMS.USE_CASE_OFFER.NUMBER_OF_PICTURES_TAKEN_PER_VEHICLE',
    control: 'form.numberOfPicturesTakenPerVehicle',
  },
];

export const INFRASTRUCTURE_CONTROLS: FormStepControl[] = [
  { title: 'FORMS.INFRASTRUCTURE.NSI_SOCKET_AVAILABLE', control: 'form.nsiSocketAvailable' },
  { title: 'FORMS.INFRASTRUCTURE.POWER_AVAILABLE', control: 'form.powerAvailable' },
  { title: 'FORMS.INFRASTRUCTURE.POE_AVAILABLE', control: 'form.poeAvailable' },
];

export const USE_CASE_ORDER_CONTROLS: FormStepControl[] = [
  {
    title: 'FORMS.USE_CASE_ORDER.ACCEPT_NEW_IMPLEMENTATION_DATE',
    control: 'form.acceptNewImplementationDate',
  },
];
