import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormSubSteps, UseCaseConfiguratorService } from 'src/app/shared';

@Directive()
export abstract class TabFormDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  abstract tabs: FormSubSteps;

  selectedTabIndex = 0;

  constructor(private route: ActivatedRoute, public configurator: UseCaseConfiguratorService) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const index = Number(params['tab-index']);

      if (Number.isInteger(index) && index >= 0 && index < this.tabs.length) {
        this.selectedTabIndex = index;
      } else {
        this.selectedTabIndex = 0;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
