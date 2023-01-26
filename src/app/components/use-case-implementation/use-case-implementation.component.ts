import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UseCaseConfiguratorService, UseCaseImplementationForm } from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-implementation',
  templateUrl: './use-case-implementation.component.html',
  styleUrls: ['./use-case-implementation.component.scss'],
})
export class UseCaseImplementationComponent
  extends FormDirective<UseCaseImplementationForm>
  implements OnInit
{
  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('implementation', this.form);
  }

  protected buildForm() {
    return this.fb.group({
      completed: [false, Validators.requiredTrue],
    });
  }
}
