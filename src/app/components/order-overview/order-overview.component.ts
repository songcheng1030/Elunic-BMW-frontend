import { Component, Input, OnInit } from '@angular/core';
import { getStepUrl, OfferStep, UseCaseCalculatorService, UseCaseDto } from 'src/app/shared';

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.scss'],
})
export class OrderOverviewComponent implements OnInit {
  @Input()
  formStep!: Partial<OfferStep['form']>;

  @Input()
  useCase!: UseCaseDto;

  getStepUrl = getStepUrl;

  init = false;

  constructor(public calc: UseCaseCalculatorService) {}

  async ngOnInit() {
    await this.calc.init();
    this.init = true;
  }
}
