import { Component, Input, OnInit } from '@angular/core';
import {
  getStepUrl,
  OfferStep,
  UseCaseCalculatorService,
  UseCaseDto,
  Variant,
} from 'src/app/shared';

@Component({
  selector: 'app-offer-overview',
  templateUrl: './offer-overview.component.html',
  styleUrls: ['./offer-overview.component.scss'],
})
export class OfferOverviewComponent implements OnInit {
  @Input()
  formStep!: Partial<OfferStep['form']>;

  @Input()
  useCase!: UseCaseDto;

  @Input()
  variants: Variant[] = [];

  getStepUrl = getStepUrl;

  init = false;

  constructor(public calc: UseCaseCalculatorService) {}

  async ngOnInit() {
    await this.calc.init();
    this.init = true;
  }
}
