import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BreadCrumbSegment } from 'src/app/components/breadcrumb/breadcrumb.component';
import { AuthService, UseCaseFilter, UseCaseFormStep, UseCaseStatus } from 'src/app/shared';

@Component({
  selector: 'app-use-cases',
  templateUrl: './use-cases.component.html',
  styleUrls: ['./use-cases.component.scss'],
})
export class UseCasesComponent implements OnInit {
  segments: BreadCrumbSegment[] = [];
  plantId$ = combineLatest([this.route.params, this.route.queryParams]).pipe(
    map(([params, queryParams]) => params['plantId'] || queryParams['plantId']),
  );
  q$ = new BehaviorSubject<string | undefined>(undefined);
  stepStatusFilter$ = new BehaviorSubject<{ steps: UseCaseFormStep[]; status: UseCaseStatus[] }>({
    steps: [],
    status: [],
  });
  filter$ = combineLatest([this.plantId$, this.q$, this.stepStatusFilter$]).pipe(
    map(([plantId, q, { steps, status }]) => {
      const filter = { plantId, steps, status };
      if (q && q.length) {
        return { ...filter, q };
      }
      return filter;
    }),
    startWith({}),
  ) as Observable<UseCaseFilter>;

  constructor(private route: ActivatedRoute, public authService: AuthService) {}

  ngOnInit(): void {
    this.segments = [
      {
        name: 'NAVIGATION.BACK_TO_AIQX_HUB',
        link: ['/'],
        backButton: true,
        translate: true,
      },
      {
        name: 'NAVIGATION.PLANTS_OVERVIEW',
        link: ['/', 'plants'],
        translate: true,
      },
      {
        name: this.route.snapshot.url[1]?.path,
        link: ['/', ...this.route.snapshot.url.map(u => u.path)],
      },
    ];
  }
}
