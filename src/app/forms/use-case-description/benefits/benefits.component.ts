import { KeyValue } from '@angular/common';
import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BenefitForm, BENEFITS_OPTS, UseCaseConfiguratorService } from 'src/app/shared';

type Benefit = keyof BenefitForm;
type BenefitValue = BenefitForm[
  | 'savesManualTest'
  | 'reducingInlineRework'
  | 'reducingOfflineRework'];

const BENEFITS_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BenefitsComponent),
  multi: true,
};

const BENEFITS_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => BenefitsComponent),
  multi: true,
};

const CALCULATED_BENEFITS: Benefit[] = [
  'savesManualTest',
  'reducingInlineRework',
  'reducingOfflineRework',
];

const OPTIONS_ORDER: Benefit[] = [
  'savesManualTest',
  'reducingInlineRework',
  'reducingOfflineRework',
  'reducingFieldCost',
  'other',
];

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.scss'],
  providers: [BENEFITS_CONTROL_ACCESSOR, BENEFITS_VALIDATORS],
})
export class BenefitsComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private onTouch!: () => void;
  private onModelChange!: (value: BenefitForm) => void;
  private destroyed$ = new Subject<void>();

  form!: FormGroup;
  openedFields: Benefit[] = [];
  isDisabled = false;

  fields = BENEFITS_OPTS;

  get savesManualTest(): AbstractControl {
    return this.form.get('savesManualTest') as AbstractControl;
  }

  get reducingInlineRework(): AbstractControl {
    return this.form.get('reducingInlineRework') as AbstractControl;
  }

  get reducingOfflineRework(): AbstractControl {
    return this.form.get('reducingOfflineRework') as AbstractControl;
  }

  get reducingFieldCost(): AbstractControl {
    return this.form.get('reducingFieldCost') as AbstractControl;
  }

  get other(): AbstractControl {
    return this.form.get('other') as AbstractControl;
  }

  constructor(private fb: FormBuilder, private configurator: UseCaseConfiguratorService) {}

  ngOnInit(): void {
    this.form = this.buildForm();
    const { benefits } = this.configurator.getStep('initial-request');
    this.openedFields = Object.keys(benefits || {}).filter(b =>
      Object.values(((benefits || {}) as BenefitForm)[b as Benefit]).some(
        v => v !== null || v !== 0,
      ),
    ) as Benefit[];

    Object.keys(this.form.controls).forEach(f => {
      if (!this.openedFields.includes(f as Benefit)) {
        this.getControl(f as Benefit).disable();
      }
    });

    this.form.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
      if (this.onTouch) {
        this.onTouch();
      }
      if (this.onModelChange) {
        this.onModelChange(this.openedFields.length < 1 ? null : value);
      }
    });

    CALCULATED_BENEFITS.forEach(b => {
      const formGroup = this.getControl(b) as FormGroup;
      // The mask input makes trouble with numbers and calculations.
      // We init once to make sure the numbers are fine.

      formGroup.valueChanges
        .pipe(takeUntil(this.destroyed$))
        .subscribe(value => this.updateBenefit(formGroup, value));
    });
  }

  fieldsKeyValueOrder(a: KeyValue<string, unknown>, b: KeyValue<string, unknown>): number {
    return OPTIONS_ORDER.indexOf(a.key as Benefit) - OPTIONS_ORDER.indexOf(b.key as Benefit);
  }

  onSelect(benefit: Benefit, checked: boolean): void {
    if (this.openedFields.includes(benefit)) {
      this.openedFields = this.openedFields.filter(f => f !== benefit);
    } else {
      this.openedFields.push(benefit);
    }

    const ctrl = this[benefit];
    // eslint-disable-next-line  @typescript-eslint/no-unused-expressions
    !checked ? ctrl.disable() : ctrl.enable();
  }

  getControl(benefit: Benefit) {
    return this[benefit];
  }

  validate(): ValidationErrors | null {
    return this.form.invalid ? { error: true } : null;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    // eslint-disable-next-line  @typescript-eslint/no-unused-expressions
    isDisabled ? this.form.disable() : this.form.enable();
  }

  writeValue(value: BenefitForm | null): void {
    if (value) {
      this.form.setValue({
        ...Object.entries(this.fields).reduce(
          (prev, [key, v]) => ({
            ...prev,
            [key]: (v.subfields as { name: string }[])
              .map(s => s.name)
              .reduce((a, b) => ({ ...a, [b]: null }), {}),
          }),
          {},
        ),
        ...Object.entries(value).reduce(
          (prev, [key, v]) => ({
            ...prev,
            [key]: CALCULATED_BENEFITS.includes(key as Benefit)
              ? Object.entries(v).reduce((a, [b, c]) => ({ ...a, [b]: Number(c) }), {})
              : v,
          }),
          {},
        ),
      });
    }
  }

  registerOnChange(fn: (value: BenefitForm) => void): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      savesManualTest: this.fb.group({
        durationTest: [null, Validators.min(1)],
        testedVehicles: [null, Validators.min(1)],
        costRate: [null, Validators.min(0)],
        resultingBenefit: [null, Validators.min(0)],
      }),
      reducingInlineRework: this.fb.group({
        expectedReductionInlineRework: [null, Validators.min(1)],
        testedVehiclesPerYear: [null, Validators.min(1)],
        costRate: [null, Validators.min(0)],
        resultingBenefit: [null, Validators.min(0)],
      }),
      reducingOfflineRework: this.fb.group({
        expectedReductionOfflineRework: [null, Validators.min(1)],
        reworkedVehicles: [null, Validators.min(1)],
        costRate: [null, Validators.min(0)],
        resultingBenefit: [null, Validators.min(0)],
      }),
      reducingFieldCost: this.fb.group({
        expectedReductionFieldCost: [null, Validators.min(1)],
      }),
      other: this.fb.group({
        value: [null],
      }),
    });
  }

  private updateBenefit(formGroup: FormGroup, value: BenefitValue) {
    const orderedValues = this.getCalcValuesInOrder(value);
    if (orderedValues.includes(null) || orderedValues.includes('')) {
      return;
    }

    const [x1, x2, x3] = orderedValues.map(v => Number.parseFloat(v as string));

    // Parse numbers according to users selected language.
    const resultingBenefit = Number(((x1 / 60) * x2 * x3).toFixed(2));
    formGroup.get('resultingBenefit')?.setValue(resultingBenefit, { emitEvent: false });
  }

  private getCalcValuesInOrder(value: BenefitValue): (string | number | null)[] {
    if ('durationTest' in value) {
      return [value.durationTest, value.testedVehicles, value.costRate];
    }
    if ('expectedReductionInlineRework' in value) {
      return [value.expectedReductionInlineRework, value.testedVehiclesPerYear, value.costRate];
    }
    if ('expectedReductionOfflineRework' in value) {
      return [value.expectedReductionOfflineRework, value.reworkedVehicles, value.costRate];
    }
    return [null, null, null];
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
