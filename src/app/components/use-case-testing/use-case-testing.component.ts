import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UseCaseConfiguratorService, UseCaseTestForm } from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-testing',
  templateUrl: './use-case-testing.component.html',
  styleUrls: ['./use-case-testing.component.scss'],
})
export class UseCaseTestingComponent extends FormDirective<UseCaseTestForm> implements OnInit {
  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('testing', this.form);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      completed: [false, Validators.requiredTrue],
    });
  }
}
