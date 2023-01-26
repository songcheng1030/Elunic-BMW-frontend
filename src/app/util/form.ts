import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { OptionalFieldDirective } from './optional-field';
import { TabFormDirective } from './tab-form';

@Directive()
export abstract class FormDirective<TForm extends object, TObject extends object = TForm>
  implements OnInit, AfterViewInit, OnDestroy
{
  protected destroy$ = new Subject<void>();
  _hideOptionalFields = false;

  @ViewChildren(OptionalFieldDirective)
  optionalFields!: QueryList<OptionalFieldDirective>;

  @Input()
  formId!: string;

  @Input()
  set hideOptionalFields(value: boolean) {
    this._hideOptionalFields = value;

    if (this.optionalFields) {
      this.toggleOptionalFields();
    }
  }

  @Output()
  created = new EventEmitter<TObject>();

  @Output()
  valid = new EventEmitter<boolean>();

  @Output()
  changed = new EventEmitter<boolean>();

  form!: FormGroup;

  constructor(protected fb: FormBuilder) {}

  protected abstract buildForm(): FormGroup;

  // eslint-disable-next-line
  protected patchValue(key: keyof TForm, value: any) {
    this.form.patchValue({ [key]: value });
  }

  ngOnInit() {
    this.form = this.buildForm();
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
        tap(() => this.changed.emit()),
        startWith(null),
        map(() => this.form.valid),
        distinctUntilChanged(),
        debounceTime(10),
      )
      .subscribe(valid => this.valid.emit(valid));

    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => this.toggleOptionalFields());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getControl(key: keyof TForm): AbstractControl {
    return this.form.controls[key as string];
  }

  hasError(prop: string): boolean {
    const control = this.form.controls[prop];
    if (control) {
      return (control.dirty || control.touched) && !!control.errors;
    }
    return false;
  }

  toggleOptionalFields() {
    this.optionalFields.forEach(c => (this._hideOptionalFields ? c.disable() : c.enable()));
  }
}

@Directive()
export abstract class EditorFormDirective<
  TForm extends object,
  TObject extends object = TForm,
> extends FormDirective<TabFormDirective, TObject> {
  @Input()
  form!: FormGroup;

  buildForm() {
    return this.form;
  }
}
