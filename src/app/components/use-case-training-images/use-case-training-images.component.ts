import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NumberOfTrainingImages, Variant } from 'src/app/shared';

const USE_CASE_TRAINING_IMAGES_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UseCaseTrainingImagesComponent),
  multi: true,
};

const USE_CASE_TRAINING_IMAGES_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UseCaseTrainingImagesComponent),
  multi: true,
};

@Component({
  selector: 'app-use-case-training-images',
  templateUrl: './use-case-training-images.component.html',
  styleUrls: ['./use-case-training-images.component.scss'],
  providers: [USE_CASE_TRAINING_IMAGES_CONTROL_ACCESSOR, USE_CASE_TRAINING_IMAGES_VALIDATORS],
})
export class UseCaseTrainingImagesComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  // eslint-disable-next-line
  private onTouch: () => void = () => {};
  // eslint-disable-next-line
  private onModelChange: (variants: NumberOfTrainingImages[]) => void = () => {};

  @Input()
  variants: Variant[] = [];

  isDisabled = false;
  dataSource!: MatTableDataSource<AbstractControl>;
  columnNames: string[] = ['variantName', 'trainingImagesForOK', 'trainingImagesForNOK'];
  form!: FormArray;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.array([]);
    this.dataSource = new MatTableDataSource(this.form.controls);

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(numberOfTrainingImages => this.onVariantsChange(numberOfTrainingImages));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(numberOfTrainingImages: NumberOfTrainingImages[] | null): void {
    if (numberOfTrainingImages) {
      this.updateVariants(numberOfTrainingImages);
    }
  }

  registerOnChange(fn: (numberOfTrainingImages: NumberOfTrainingImages[]) => void): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  validate(): ValidationErrors | null {
    return this.form.valid ? null : { error: true };
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    // eslint-disable-next-line  @typescript-eslint/no-unused-expressions
    isDisabled ? this.form.disable() : this.form.enable();
  }

  private updateVariants(numberOfTrainingImages: NumberOfTrainingImages[]) {
    const forms = numberOfTrainingImages.map((variant, i) => this.createVariant(i, variant));

    this.form.clear();
    forms.forEach(control => {
      this.form.push(control);
      if (this.isDisabled) {
        control.disable();
      }
    });
    this.form.updateValueAndValidity();
    this.dataSource._updateChangeSubscription();
  }

  private onVariantsChange(numberOfTrainingImages: NumberOfTrainingImages[]): void {
    this.onTouch();
    this.onModelChange(numberOfTrainingImages);
    this.dataSource._updateChangeSubscription();
  }

  private createVariant(index: number, variant: NumberOfTrainingImages): FormGroup {
    return this.fb.group({
      trainingImagesForOK: [variant.trainingImagesForOK, [Validators.required]],
      trainingImagesForNOK: [variant.trainingImagesForNOK, [Validators.required]],
    });
  }
}
