import {
  AfterViewInit,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  OtherSelectOption,
  ProjectPlanningGroup,
  UseCaseConfiguratorService,
} from 'src/app/shared';
import { OptionalFieldDirective } from 'src/app/util';

const PROJECT_PLANNING_GROUP_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProjectPlanningGroupComponent),
  multi: true,
};

const PROJECT_PLANNING_GROUP_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ProjectPlanningGroupComponent),
  multi: true,
};

@Component({
  selector: 'app-project-planning-group',
  templateUrl: './project-planning-group.component.html',
  styleUrls: ['./project-planning-group.component.scss'],
  providers: [PROJECT_PLANNING_GROUP_CONTROL_ACCESSOR, PROJECT_PLANNING_GROUP_VALIDATORS],
})
export class ProjectPlanningGroupComponent
  implements ControlValueAccessor, OnInit, OnDestroy, AfterViewInit
{
  private isDisabled = false;
  form!: FormGroup;

  @ViewChildren(OptionalFieldDirective)
  optionalFields!: QueryList<OptionalFieldDirective>;

  @Input()
  title!: string;

  @Input()
  required!: boolean;

  @Input()
  functionOptions?: OtherSelectOption[];

  @Input()
  requireInformed!: boolean;

  @Input()
  set touched(value: boolean) {
    if (value) {
      this.form.markAllAsTouched();
    }
  }

  // eslint-disable-next-line
  private onTouch = () => {};
  // eslint-disable-next-line
  private onModelChange = (value: ProjectPlanningGroup) => {};
  private destroyed$ = new Subject<void>();

  constructor(private fb: FormBuilder, public configurator: UseCaseConfiguratorService) {}

  ngOnInit(): void {
    const val = this.required ? [Validators.required] : [];
    this.form = this.fb.group({
      name: [null, val],
      department: [null, val],
    });

    if (this.requireInformed) {
      this.form.addControl('informed', this.fb.control(false, [Validators.requiredTrue]));
    }
    if (this.functionOptions) {
      this.form.addControl(
        'function',
        this.fb.group({ name: [null, Validators.required], value: [true, Validators.required] }),
      );
    }

    const ctrls = Object.values(this.form.controls);
    this.form.valueChanges.pipe(takeUntil(this.destroyed$), debounceTime(100)).subscribe(value => {
      this.onModelChange(value);
      // All touched
      if (!ctrls.some(ctrl => !ctrl.touched)) {
        this.onTouch();
      }
    });
  }

  ngAfterViewInit() {
    this.configurator.showMandatoryOnly$.pipe(takeUntil(this.destroyed$)).subscribe(value => {
      (this.optionalFields || []).forEach(c => (value ? c.disable() : c.enable()));
      if (!this.required && !this.isDisabled) {
        this.setDisabledState(value);
        if (this.requireInformed) {
          this.form.get('informed')?.enable();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  writeValue(value: ProjectPlanningGroup): void {
    if (value) {
      this.form.patchValue(value);
    }
  }

  validate(): ValidationErrors | null {
    return this.form.valid ? null : { error: true };
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  registerOnChange(fn: (value: ProjectPlanningGroup) => void): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = () => {
      this.form.markAllAsTouched();
      fn();
    };
  }

  onFunctionChange(value: string) {
    const ctrl = this.form.controls['function'];
    if (ctrl instanceof FormGroup) {
      ctrl.setValue({ name: value, value: value === 'other' ? '' : true });
    }
  }
}
