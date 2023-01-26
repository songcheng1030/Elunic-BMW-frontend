import { Component, Input, OnInit } from '@angular/core';
import {
  BENEFITS_OPTS,
  DefinitionForm,
  FormSelectOption,
  getStepUrl,
  ImageAttachmentDto,
  InitialRequestStep,
  POSITION_IN_VEHICLE_OPTS,
  PROJECT_PLANNING_REQUESTOR_FUNCTION_OPTIONS,
  TYPE_OF_INSPECTION_OPTS,
  UseCaseConfiguratorService,
  UseCaseDto,
} from 'src/app/shared';

type BenefitForm = DefinitionForm['benefits'];
type Benefit = keyof BenefitForm;

@Component({
  selector: 'app-initial-request-overview',
  templateUrl: './initial-request-overview.component.html',
  styleUrls: ['./initial-request-overview.component.scss'],
})
export class InitialRequestOverviewComponent implements OnInit {
  @Input()
  formStep!: Partial<InitialRequestStep['form']>;

  @Input()
  useCase!: UseCaseDto;

  @Input()
  exampleAttachments!: ImageAttachmentDto[];

  getStepUrl = getStepUrl;

  benefitFields = BENEFITS_OPTS;
  typeOfInspectionOptions = TYPE_OF_INSPECTION_OPTS;
  positionInVehicleOptions = POSITION_IN_VEHICLE_OPTS;

  requestorFunction?: FormSelectOption;

  constructor(public configurator: UseCaseConfiguratorService) {}

  ngOnInit(): void {
    this.requestorFunction = this.getRequestorFunction();
  }

  getBenefitValues(benefits?: BenefitForm) {
    return Object.entries(benefits || {}).map(([key, value]) => ({ key, value }));
  }

  getBenefitField(key: Benefit) {
    return this.benefitFields[key];
  }

  getTypeLabel(type: string): string {
    const temp = this.typeOfInspectionOptions.find(el => el.value === type);
    if (temp) {
      return temp.label;
    } else {
      return '';
    }
  }

  getPositionInVehicleLabel(name: string): string {
    const temp = this.positionInVehicleOptions.find(el => el.value === name);
    if (temp) {
      return temp.label;
    } else {
      return '';
    }
  }

  getBoolean(value?: boolean | string): string | null {
    if (typeof value === 'string') {
      return null;
    }
    if (typeof value === 'boolean') {
      return value ? 'LABEL.YES' : 'LABEL.NO';
    }
    return '';
  }

  private getRequestorFunction(): FormSelectOption | undefined {
    const req = this.formStep.requestor;
    if (req?.function && req.function.name === 'other') {
      // Map special case 'other' to a regular select option to stay uniform.
      return { label: req.function.value as string, value: 'other' };
    }

    return PROJECT_PLANNING_REQUESTOR_FUNCTION_OPTIONS.find(
      option => typeof req?.function?.name === 'string' && option.value === req?.function?.name,
    );
  }
}
