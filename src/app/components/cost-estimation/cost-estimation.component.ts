import { Component, Input, OnInit } from '@angular/core';
import { OfferStep, UseCaseCalculatorService } from 'src/app/shared';

@Component({
  selector: 'app-cost-estimation',
  templateUrl: './cost-estimation.component.html',
  styleUrls: ['./cost-estimation.component.scss'],
})
export class CostEstimationComponent implements OnInit {
  @Input()
  offer!: Partial<OfferStep['form']>;

  init = false;

  constructor(public calc: UseCaseCalculatorService) {}

  async ngOnInit() {
    await this.calc.init();
    this.init = true;
  }
}
