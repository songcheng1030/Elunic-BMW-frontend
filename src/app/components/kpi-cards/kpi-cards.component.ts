import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import {
  roundDuration,
  StatusKpiDto,
  USE_CASE_FORM_NAME_MAP,
  UseCaseFormStep,
  UseCaseService,
} from 'src/app/shared';

interface KpiCardContent {
  title: string;
  time: string;
}

@Component({
  selector: 'app-kpi-cards',
  templateUrl: './kpi-cards.component.html',
  styleUrls: ['./kpi-cards.component.scss'],
})
export class KpiCardsComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  @Input()
  plantId!: string;

  kpis: KpiCardContent[] = [];

  constructor(private useCaseService: UseCaseService, private translate: TranslateService) {}

  async ngOnInit() {
    const kpis = await this.useCaseService.getPlantKpis(this.plantId).toPromise();
    this.changeStatusToArray(kpis);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  changeStatusToArray(kpis: StatusKpiDto) {
    this.kpis = Object.entries(kpis).map(([key, value]) => {
      const title = USE_CASE_FORM_NAME_MAP[key as UseCaseFormStep] || '';

      const decimalSep = this.translate.instant('COMMON.DECIMAL_SEPARATOR');
      const thousandSep = this.translate.instant('COMMON.THOUSAND_SEPARATOR');
      const days = roundDuration(value).toString();
      const time = days.replace(thousandSep, decimalSep);

      return { title, time };
    });
  }
}
