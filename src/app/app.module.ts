import '@angular/common/locales/global/de';
import '@angular/common/locales/global/en';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpBackend, HttpClient, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
  MatRippleModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { LogModule } from 'ng-debug-levels';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { FileUploadModule } from 'ng2-file-upload';
import { CookieService } from 'ngx-cookie-service';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxLoaderIndicatorModule } from 'ngx-loader-indicator';
import { NgxMaskModule } from 'ngx-mask';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AttachmentsTableComponent } from './components/attachments-table/attachments-table.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CostEstimationComponent } from './components/cost-estimation/cost-estimation.component';
import { DetailedRequestOverviewComponent } from './components/detailed-request-overview/detailed-request-overview.component';
import { FileUploaderDropdownComponent } from './components/file-uploader-dropdown/file-uploader-dropdown.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormContainerComponent } from './components/form-container/form-container.component';
import { FormStepperSidebarComponent } from './components/form-stepper-sidebar/form-stepper-sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderSearchComponent } from './components/header-search/header-search.component';
import { ImageAnnotationComponent } from './components/image-annotation/image-annotation.component';
import { InitialFeasibilityCheckOverviewComponent } from './components/initial-feasibility-check-overview/initial-feasibility-check-overview.component';
import { InitialRequestOverviewComponent } from './components/initial-request-overview/initial-request-overview.component';
import { KpiCardsComponent } from './components/kpi-cards/kpi-cards.component';
import { OfferOverviewComponent } from './components/offer-overview/offer-overview.component';
import { OrderOverviewComponent } from './components/order-overview/order-overview.component';
import { SearchComponent } from './components/search/search.component';
import { SetupDetailsOverviewComponent } from './components/setup-details-overview/setup-details-overview.component';
import { StepFilterComponent } from './components/step-filter/step-filter.component';
import { TablePaginatorComponent } from './components/table-paginator/table-paginator.component';
import { UseCaseAnnotationsComponent } from './components/use-case-annotations/use-case-annotations.component';
import { UseCaseApprovalComponent } from './components/use-case-approval/use-case-approval.component';
import { UseCaseApprovalOverviewComponent } from './components/use-case-approval-overview/use-case-approval-overview.component';
import { UseCaseImplementationComponent } from './components/use-case-implementation/use-case-implementation.component';
import { UseCaseLiveComponent } from './components/use-case-live/use-case-live.component';
import { UseCaseStepComponent } from './components/use-case-steps/use-case-step/use-case-step.component';
import { UseCaseStepsComponent } from './components/use-case-steps/use-case-steps.component';
import { UseCaseTestingComponent } from './components/use-case-testing/use-case-testing.component';
import { UseCaseTrainingImagesComponent } from './components/use-case-training-images/use-case-training-images.component';
import { UseCaseVariantsComponent } from './components/use-case-variants/use-case-variants.component';
import { UseCasesTableComponent } from './components/use-cases-table/use-cases-table.component';
import { VariantsComponent } from './components/variants-table/variants/variants.component';
import { VariantsTableComponent } from './components/variants-table/variants-table.component';
import { CameraPositionDefinitionComponent } from './forms/camera-position-definition/camera-position-definition.component';
import { EstimatedPriceComponent } from './forms/estimated-price/estimated-price.component';
import { FeatureDefinitionComponent } from './forms/feature-definition/feature-definition.component';
import { FinalCameraLocationComponent } from './forms/final-camera-location/final-camera-location.component';
import { HardwareInventoryComponent } from './forms/hardware-inventory/hardware-inventory.component';
import { HardwareSetupImageComponent } from './forms/hardware-setup-image/hardware-setup-image.component';
import { InfrastructureComponent } from './forms/infrastructure/infrastructure.component';
import { IpsPlcTriggerComponent } from './forms/ips-plc-trigger/ips-plc-trigger.component';
import { MonikerComponent } from './forms/moniker/moniker.component';
import { NeededSystemConfigurationComponent } from './forms/needed-system-configuration/needed-system-configuration.component';
import { NsiPlugComponent } from './forms/nsi-plug/nsi-plug.component';
import { OutputSystemComponent } from './forms/output-system/output-system.component';
import { ProjectPlanningComponent } from './forms/project-planning/project-planning.component';
import { ProjectPlanningGroupComponent } from './forms/project-planning/project-planning-group/project-planning-group.component';
import { UseCaseComplexityDefinitionComponent } from './forms/use-case-complexity-definition/use-case-complexity-definition.component';
import { BenefitsComponent } from './forms/use-case-description/benefits/benefits.component';
import { UseCaseDescriptionComponent } from './forms/use-case-description/use-case-description.component';
import { UseCaseDetailComponent } from './forms/use-case-detail/use-case-detail.component';
import { UseCaseImplementationFeasibilityCheckComponent } from './forms/use-case-implementation-feasibility-check/use-case-implementation-feasibility-check.component';
import { UseCaseOrderComponent } from './forms/use-case-order/use-case-order.component';
import { UseCaseVariantComponent } from './forms/use-case-variant/use-case-variant.component';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { UseCasesStepConfirmComponent } from './modals/use-cases-step-confirm/use-cases-step-confirm.component';
import { PlantsComponent } from './pages/plants/plants.component';
import { UseCaseCreateComponent } from './pages/use-cases/use-case-form-outlet/use-case-create/use-case-create.component';
import { UseCaseDetailsComponent } from './pages/use-cases/use-case-form-outlet/use-case-details/use-case-details.component';
import { UseCaseFeasibilityCheckComponent } from './pages/use-cases/use-case-form-outlet/use-case-feasibility-check/use-case-feasibility-check.component';
import { UseCaseFormOutletComponent } from './pages/use-cases/use-case-form-outlet/use-case-form-outlet.component';
import { UseCaseHardwareDetailsComponent } from './pages/use-cases/use-case-form-outlet/use-case-hardware-details/use-case-hardware-details.component';
import { UseCaseOfferComponent } from './pages/use-cases/use-case-form-outlet/use-case-offer/use-case-offer.component';
import { UseCaseOrderingComponent } from './pages/use-cases/use-case-form-outlet/use-case-ordering/use-case-ordering.component';
import { UseCaseSetupDetailsComponent } from './pages/use-cases/use-case-form-outlet/use-case-setup-details/use-case-setup-details.component';
import { UseCaseProgressComponent } from './pages/use-cases/use-case-progress/use-case-progress.component';
import { UseCasesComponent } from './pages/use-cases/use-cases.component';
import {
  ErrorInterceptor,
  Lang,
  ModalComponent,
  RoleGuard,
  SafePipe,
  ShortDatePipe,
  ShortPipe,
  ShortTimePipe,
  SUPPORTED_LANGS,
  TruncatePipe,
  UsernamePipe,
  WithCredentialsInterceptor,
} from './shared';
import { appEffects, metaReducers, reducers } from './store';
import { OptionalFieldDirective, UserRoleDirective } from './util';

export function HttpLoaderFactory(backend: HttpBackend) {
  const http = new HttpClient(backend);
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json?v=' + Date.now());
}

export function LocaleFactory(translate: TranslateService) {
  const browserLang = (translate.getBrowserLang() || 'en').toLowerCase();
  const lang = SUPPORTED_LANGS.includes(browserLang as Lang) ? browserLang : 'en';
  return lang as Lang;
}

const DATE_FORMATS: Record<Lang, MatDateFormats> = {
  en: {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'MM/DD/YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY',
    },
  },
  de: {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'DD.MM.YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY',
    },
  },
};

export function DateFormatFactory(translate: TranslateService) {
  const lang = LocaleFactory(translate);
  return DATE_FORMATS[lang];
}

@NgModule({
  declarations: [
    AppComponent,
    UseCasesTableComponent,
    FooterComponent,
    HeaderComponent,
    UseCasesComponent,
    PlantsComponent,
    ModalComponent,
    ConfirmComponent,
    UseCasesStepConfirmComponent,
    SearchComponent,
    HeaderSearchComponent,
    TablePaginatorComponent,
    UseCaseCreateComponent,
    FormStepperSidebarComponent,
    BreadcrumbComponent,
    UseCaseProgressComponent,
    SafePipe,
    TruncatePipe,
    ShortDatePipe,
    ShortTimePipe,
    ShortPipe,
    UsernamePipe,
    UseCaseDescriptionComponent,
    BenefitsComponent,
    UseCaseStepsComponent,
    UseCaseStepComponent,
    FileUploaderDropdownComponent,
    ImageAnnotationComponent,
    OptionalFieldDirective,
    ProjectPlanningComponent,
    ProjectPlanningGroupComponent,
    FeatureDefinitionComponent,
    UseCaseAnnotationsComponent,
    UseCaseFormOutletComponent,
    UseCaseDetailsComponent,
    UseCaseVariantComponent,
    UseCaseDetailComponent,
    NeededSystemConfigurationComponent,
    FinalCameraLocationComponent,
    UseCaseOrderComponent,
    UseCaseOrderingComponent,
    UseCaseFeasibilityCheckComponent,
    UseCaseHardwareDetailsComponent,
    FormContainerComponent,
    UseCaseVariantsComponent,
    UseCaseTrainingImagesComponent,
    UseCaseImplementationFeasibilityCheckComponent,
    UseCaseComplexityDefinitionComponent,
    CameraPositionDefinitionComponent,
    EstimatedPriceComponent,
    InfrastructureComponent,
    AttachmentsTableComponent,
    VariantsComponent,
    KpiCardsComponent,
    VariantsTableComponent,
    UserRoleDirective,
    UseCaseOfferComponent,
    InitialRequestOverviewComponent,
    InitialFeasibilityCheckOverviewComponent,
    DetailedRequestOverviewComponent,
    OfferOverviewComponent,
    OrderOverviewComponent,
    CostEstimationComponent,
    UseCaseSetupDetailsComponent,
    MonikerComponent,
    NsiPlugComponent,
    IpsPlcTriggerComponent,
    HardwareInventoryComponent,
    HardwareSetupImageComponent,
    OutputSystemComponent,
    SetupDetailsOverviewComponent,
    StepFilterComponent,
    UseCaseImplementationComponent,
    UseCaseTestingComponent,
    UseCaseApprovalComponent,
    UseCaseLiveComponent,
    UseCaseApprovalOverviewComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LogModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatProgressBarModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgxFileDropModule,
    FileUploadModule,
    MatTabsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatRadioModule,
    ScrollingModule,
    TableVirtualScrollModule,
    GalleryModule,
    LightboxModule,
    EditorModule,
    NgxMaskModule.forRoot({
      validation: false,
    }),
    NgxLoaderIndicatorModule.forRoot({
      img: 'assets/icons/spinner.svg',
      imgStyles: {
        width: '60px',
        color: '#1c69d4',
      },
    }),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot(appEffects),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
      defaultLanguage: 'en',
    }),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useFactory: LocaleFactory,
      deps: [TranslateService],
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: LocaleFactory,
      deps: [TranslateService],
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useFactory: DateFormatFactory,
      deps: [TranslateService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: 'tinymce/tinymce.min.js',
    },
    RoleGuard,
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
