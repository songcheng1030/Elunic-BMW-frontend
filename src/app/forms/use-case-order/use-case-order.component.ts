import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { startWith, takeUntil } from 'rxjs/operators';
import { UseCaseConfiguratorService, UseCaseOrderForm } from 'src/app/shared';
import { FormDirective } from 'src/app/util';

interface ImplementationDate {
  completionDate: Date;
  timelineForImplementation: Date;
}

@Component({
  selector: 'app-use-case-order',
  templateUrl: './use-case-order.component.html',
  styleUrls: ['./use-case-order.component.scss'],
})
export class UseCaseOrderComponent extends FormDirective<UseCaseOrderForm> implements OnInit {
  implementationDate: ImplementationDate = {
    completionDate: new Date(),
    timelineForImplementation: new Date(),
  };
  showError = false;

  get acceptNewImplementationDate(): FormControl {
    return this.getControl('acceptNewImplementationDate') as FormControl;
  }

  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.acceptNewImplementationDate.valueChanges
      .pipe(takeUntil(this.destroy$), startWith(this.acceptNewImplementationDate.value))
      .subscribe((value: boolean) => {
        const { completionDate } = this.configurator.getStep('initial-request');
        const { timelineForImplementation } = this.configurator.getStep('offer');
        this.implementationDate = {
          completionDate: completionDate || new Date(),
          timelineForImplementation: timelineForImplementation || new Date(),
        };

        if (completionDate && timelineForImplementation) {
          this.showError = !moment(completionDate).isSame(timelineForImplementation, 'day');
        }

        this.configurator.offerAcceptable$.next(value || !this.showError);
      });

    this.configurator.register('order', this.form);
  }

  getIconUrl(): string {
    if (!this.showError) {
      return 'assets/icons/calendar_check.svg';
    }
    if (this.acceptNewImplementationDate.value) {
      return 'assets/icons/calendar_check.svg';
    }
    return 'assets/icons/calendar_warning.svg';
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      acceptNewImplementationDate: [false],
    });
  }
}
