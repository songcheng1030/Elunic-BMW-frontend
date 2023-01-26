import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';

import { UseCaseApprovalComponent } from './components/use-case-approval/use-case-approval.component';
import { UseCaseImplementationComponent } from './components/use-case-implementation/use-case-implementation.component';
import { UseCaseLiveComponent } from './components/use-case-live/use-case-live.component';
import { UseCaseTestingComponent } from './components/use-case-testing/use-case-testing.component';
import { PlantsComponent } from './pages/plants/plants.component';
import { UseCaseResolver } from './pages/use-cases/use-case.resolver';
import { UseCaseCreateComponent } from './pages/use-cases/use-case-form-outlet/use-case-create/use-case-create.component';
import { UseCaseDetailsComponent } from './pages/use-cases/use-case-form-outlet/use-case-details/use-case-details.component';
import { UseCaseFeasibilityCheckComponent } from './pages/use-cases/use-case-form-outlet/use-case-feasibility-check/use-case-feasibility-check.component';
import { UseCaseFormOutletCanDeactivateGuard } from './pages/use-cases/use-case-form-outlet/use-case-form-outlet.can-deactivate.guard';
import { UseCaseFormOutletComponent } from './pages/use-cases/use-case-form-outlet/use-case-form-outlet.component';
import { UseCaseOfferComponent } from './pages/use-cases/use-case-form-outlet/use-case-offer/use-case-offer.component';
import { UseCaseOrderingComponent } from './pages/use-cases/use-case-form-outlet/use-case-ordering/use-case-ordering.component';
import { UseCaseSetupDetailsComponent } from './pages/use-cases/use-case-form-outlet/use-case-setup-details/use-case-setup-details.component';
import { UseCaseProgressComponent } from './pages/use-cases/use-case-progress/use-case-progress.component';
import { UseCasesComponent } from './pages/use-cases/use-cases.component';
import { UseCaseFormStep } from './shared/models';

type FormRoute = Route & {
  path: UseCaseFormStep;
};

const FORM_ROUTES: FormRoute[] = [
  {
    path: 'initial-request',
    component: UseCaseCreateComponent,
  },
  {
    path: 'initial-feasibility-check',
    component: UseCaseFeasibilityCheckComponent,
  },
  {
    path: 'detailed-request',
    component: UseCaseDetailsComponent,
  },
  {
    path: 'offer',
    component: UseCaseOfferComponent,
  },
  {
    path: 'order',
    component: UseCaseOrderingComponent,
  },
  {
    path: 'setup-details',
    component: UseCaseSetupDetailsComponent,
  },
  {
    path: 'implementation',
    component: UseCaseImplementationComponent,
  },
  {
    path: 'testing',
    component: UseCaseTestingComponent,
  },
  {
    path: 'approval',
    component: UseCaseApprovalComponent,
  },
  {
    path: 'live',
    component: UseCaseLiveComponent,
  },
];

const routes: Routes = [
  { path: 'plants', component: PlantsComponent },
  { path: 'plants/:plantId', component: PlantsComponent },
  { path: 'plants/:plantId/use-cases', component: UseCasesComponent },
  { path: 'use-cases', component: UseCasesComponent },
  {
    path: 'use-cases/new',
    component: UseCaseFormOutletComponent,
    canDeactivate: [UseCaseFormOutletCanDeactivateGuard],
    children: [
      {
        path: '',
        component: UseCaseCreateComponent,
      },
      ...FORM_ROUTES,
    ],
  },
  {
    path: 'use-cases/:useCaseId',
    component: UseCaseProgressComponent,
    resolve: { useCase: UseCaseResolver },
  },
  {
    path: 'use-cases/edit/:useCaseId',
    component: UseCaseFormOutletComponent,
    canDeactivate: [UseCaseFormOutletCanDeactivateGuard],
    resolve: { useCase: UseCaseResolver },
    children: [
      {
        path: '',
        redirectTo: 'initial-request',
        pathMatch: 'full',
      },
      ...FORM_ROUTES,
    ],
  },
  { path: '', redirectTo: '/plants', pathMatch: 'full' },
  { path: '**', redirectTo: '/plants' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
