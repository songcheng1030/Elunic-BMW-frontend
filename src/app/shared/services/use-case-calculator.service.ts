import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { CombinationData, Costs, OfferStep } from '../models';

@Injectable({ providedIn: 'root' })
export class UseCaseCalculatorService {
  private combinationData!: CombinationData;
  currency: keyof Costs = 'EUR';

  get currencySymbol() {
    return this.currency === 'EUR' ? '€' : '$';
  }

  constructor(private http: HttpClient) {}

  async init() {
    if (!this.combinationData) {
      this.combinationData = await this.http
        .get<CombinationData>('assets/data/cost.json')
        .pipe(take(1))
        .toPromise();
    }
  }

  getOneTimeCost(offer: Partial<OfferStep['form']>) {
    const hardwareCost = this.getHardwareCostEstimation(offer);
    const installationCost = this.getInstallationCost(offer);
    const implementationCost = this.getImplementationCost(offer);
    return hardwareCost + installationCost + implementationCost;
  }

  getHardwareCostEstimation(offer: Partial<OfferStep['form']>) {
    const cost = offer.hardwareCostEstimation;
    return cost ? Number(cost) : 0;
  }

  getInstallationCost(offer: Partial<OfferStep['form']>) {
    const cost = offer.installationCost;
    return cost ? Number(cost) : 0;
  }

  getImplementationCost(offer: Partial<OfferStep['form']>) {
    const { complexityForDataScience, complexityForBusiness } = offer;
    const combination = this.combinationData.combination_implementation;
    if (!complexityForBusiness || !complexityForDataScience || !combination) {
      return 0;
    }

    const costs = combination[complexityForBusiness][complexityForDataScience];
    return costs[this.currency];
  }

  getYearlyCost(offer: Partial<OfferStep['form']>) {
    const { complexityForDataScience, complexityForBusiness } = offer;
    const combination = this.combinationData.combination_yearly;
    if (!complexityForBusiness || !complexityForDataScience || !combination) {
      return 0;
    }

    const costs = combination[complexityForBusiness][complexityForDataScience];
    return costs[this.currency];
  }
}
