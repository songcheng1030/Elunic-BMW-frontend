import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { takeUntil } from 'rxjs/operators';
import {
  CombinationData,
  DefinitionForm,
  DESC_MAX_LENGTH,
  NO_DOT_PATTERN,
  PART_AVAILABILITY_OPTS,
  UseCaseConfiguratorService,
  UseCaseDto,
} from 'src/app/shared';
import { FormDirective } from 'src/app/util';

interface UseCaseForm extends UseCaseDto, DefinitionForm {}

@Component({
  selector: 'app-use-case-description',
  templateUrl: './use-case-description.component.html',
  styleUrls: ['./use-case-description.component.scss'],
})
export class UseCaseDescriptionComponent
  extends FormDirective<UseCaseForm, UseCaseDto>
  implements OnInit, AfterViewInit
{
  descriptionMaxLength = DESC_MAX_LENGTH;
  costs: Partial<CombinationData> = {};

  partAvailableOptions = PART_AVAILABILITY_OPTS;

  get description(): FormControl {
    return this.getControl('description') as FormControl;
  }

  get reasonOfUrgency(): FormControl {
    return this.getControl('reasonOfUrgency') as FormControl;
  }

  get inspectionFeatureAvailable(): FormControl {
    return this.getControl('inspectionFeatureAvailable').get('value') as FormControl;
  }

  get productionOrPreSeries(): FormControl {
    return this.getControl('inspectionFeatureAvailable').get(
      'productionOrPreSeries',
    ) as FormControl;
  }

  get partAvailableFrom(): FormControl {
    return this.getControl('inspectionFeatureAvailable').get('partAvailableFrom') as FormControl;
  }

  constructor(
    protected fb: FormBuilder,
    private configurator: UseCaseConfiguratorService,
    private httpClient: HttpClient,
  ) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.inspectionFeatureAvailable.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value === true) {
        this.partAvailableFrom.disable();
        this.productionOrPreSeries.enable();
      } else {
        this.partAvailableFrom.enable();
        this.productionOrPreSeries.disable();
      }
    });

    this.httpClient.get('assets/data/cost.json').subscribe(data => {
      this.costs = data as CombinationData;
    });

    this.configurator.register('description', this.form);

    if (this.configurator.canEditStep('initial-request')) {
      Object.values(this.configurator.getRootControls()).forEach(ctrl => {
        ctrl.enable();
        ctrl.markAsPristine();
      });
    }
  }

  ngAfterViewInit() {
    const { reasonOfUrgency } = this.configurator.getStep('initial-request');
    if (!reasonOfUrgency) {
      requestAnimationFrame(() => this.reasonOfUrgency.disable());
    } else {
      this.reasonOfUrgency.setValue(reasonOfUrgency);
    }
  }

  protected buildForm(): FormGroup {
    const form = this.fb.group({
      description: [null, [Validators.required, Validators.maxLength(this.descriptionMaxLength)]],
      costsCoveredByDepartment: [false, Validators.requiredTrue],
      inspectionFeatureAvailable: this.fb.group({
        value: [null, Validators.required],
        productionOrPreSeries: [null, Validators.required],
        partAvailableFrom: [null, Validators.required],
      }),
      benefits: [null],
      biRating: [null, Validators.required],
      reasonOfUrgency: [null],
    });

    // Add root prop controls to this form.
    const controls = this.configurator.getRootControls();
    // Ensure these shared controls are not required in this form.
    controls.line.setValidators(Validators.pattern(NO_DOT_PATTERN));
    controls.position.setValidators(Validators.pattern(NO_DOT_PATTERN));
    Object.entries(controls).map(([key, value]) => form.addControl(key, value));
    return form;
  }

  toggleControlAvailability(ev: MatCheckboxChange): void {
    const control = this.reasonOfUrgency;
    if (!ev.checked) {
      control.disable();
      control.clearValidators();
    } else {
      control.enable();
      control.setValidators(Validators.required);
    }
    this.form.updateValueAndValidity();
  }
}
