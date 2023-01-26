import { Component, Input, OnInit } from '@angular/core';
import {
  AttachmentDto,
  DetailedRequestStep,
  FormSelectOption,
  getStepUrl,
  ORDER_DATA_OPTS,
  RADIO_WITH_UNKNOWN_OPTS,
  RadioWithUnknown,
  TRIGGER_OPTS,
  UseCaseConfiguratorService,
  UseCaseDto,
  VALIDATION_RESULT_OPTS,
  Variant,
} from 'src/app/shared';

@Component({
  selector: 'app-detailed-request-overview',
  templateUrl: './detailed-request-overview.component.html',
  styleUrls: ['./detailed-request-overview.component.scss'],
})
export class DetailedRequestOverviewComponent implements OnInit {
  @Input()
  formStep!: Partial<DetailedRequestStep['form']>;

  @Input()
  useCase!: UseCaseDto;

  @Input()
  attachments: AttachmentDto[] = [];

  @Input()
  variants: Variant[] = [];

  getStepUrl = getStepUrl;

  constructor(public configurator: UseCaseConfiguratorService) {}

  ngOnInit(): void {}

  getRadioValue(value?: RadioWithUnknown) {
    return this.getOption(value, RADIO_WITH_UNKNOWN_OPTS);
  }

  getOrderData(value: string) {
    return this.getOption(value, ORDER_DATA_OPTS);
  }

  getTrigger(value: string) {
    return this.getOption(value, TRIGGER_OPTS);
  }

  getValidationResult(value: string) {
    return this.getOption(value, VALIDATION_RESULT_OPTS);
  }

  private getOption(value: unknown, options: FormSelectOption[]) {
    const entry = options.find(opt => value === opt.value);
    return entry ? entry.label : '';
  }
}
