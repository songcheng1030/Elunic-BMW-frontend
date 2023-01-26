import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import {
  AuthService,
  FormStep,
  getStepLabel,
  getSubmitButtonName,
  getUseCaseName,
  STEPS,
  SUB_STEPS_MAP,
  UseCaseConfiguratorService,
  UseCaseFormSubStep,
} from 'src/app/shared';
import { Plant, State } from 'src/app/store';

@Component({
  selector: 'app-form-stepper-sidebar',
  templateUrl: './form-stepper-sidebar.component.html',
  styleUrls: ['./form-stepper-sidebar.component.scss'],
})
export class FormStepperSidebarComponent implements OnInit {
  private _steps: FormStep[] = [];
  @Input()
  mainStepIndex = 0;

  @Output()
  mainStepIndexChange = new EventEmitter<number>();

  @Input()
  set steps(steps: FormStep[]) {
    this._steps = steps || [];
  }

  get steps() {
    return this._steps;
  }

  @Output()
  save = new EventEmitter<void>();

  @Output()
  // eslint-disable-next-line
  submit = new EventEmitter<void>();

  @Output()
  delete = new EventEmitter<string>();

  @Output()
  cancel = new EventEmitter<void>();

  get useCaseName() {
    if (this.configurator.name) {
      return this.configurator.name;
    }

    const { plantId, building, line, position, name } = this.configurator.getDto();
    if (plantId && building && name) {
      return getUseCaseName(plantId, building, line, position, name);
    }
    return '';
  }

  get currentStep() {
    return STEPS[this.mainStepIndex || 0].form;
  }

  get completedSteps() {
    return this.configurator.isUseCaseDone()
      ? STEPS.length
      : this.configurator.completedSteps.length;
  }

  plantId$ = this.configurator.getRootControls()['plantId'].valueChanges as Observable<
    string | undefined
  >;
  subStepIndex$ = this.route.queryParams.pipe(
    map(params => Number(params['tab-index'] || 0), startWith(0)),
  );
  plantName$ = this.plantId$.pipe(
    switchMap(id => (id ? this.store.select(Plant.selectPlantById(id)) : of(undefined))),
    map(plant => (plant ? plant.name : '')),
  );
  saveDisabled$ = this.configurator.canSubmit$.pipe(
    map(value => !value || !this.configurator.canEditStep(this.currentStep)),
  );
  submitDisabled$ = combineLatest([this.configurator.disabledSteps$, this.saveDisabled$]).pipe(
    map(
      ([steps, saveDisabled]) =>
        saveDisabled ||
        steps.includes(this.currentStep) ||
        !this.configurator.canComplete(this.currentStep),
    ),
    shareReplay(),
  );
  visitedSteps$ = new BehaviorSubject(new Set<UseCaseFormSubStep>());

  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    public configurator: UseCaseConfiguratorService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.subStepIndex$.subscribe(index => {
      const subStep = SUB_STEPS_MAP[this.currentStep][index];
      const set = this.visitedSteps$.value;
      set.add(subStep);
      this.visitedSteps$.next(set);
    });
  }

  getSubmitButtonName = getSubmitButtonName;
  getStepLabel = getStepLabel;

  onMainStepSelect(index: number) {
    this.mainStepIndex = index;
    this.mainStepIndexChange.emit(index);
  }

  onStepSelect(index: number) {
    this.router.navigate([], { queryParams: { 'tab-index': index }, queryParamsHandling: 'merge' });
  }

  getXPos(idx: number): string {
    const pos = ((100 * idx) / STEPS.length).toFixed(2);
    return pos + '%';
  }
}
