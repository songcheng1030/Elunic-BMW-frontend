import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfrastructureForm, UseCaseConfiguratorService, UseCaseDto } from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-infrastructure',
  templateUrl: './infrastructure.component.html',
  styleUrls: ['./infrastructure.component.scss'],
})
export class InfrastructureComponent
  extends FormDirective<InfrastructureForm, UseCaseDto>
  implements OnInit
{
  get nsiSocketAvailable() {
    return this.getControl('nsiSocketAvailable');
  }

  constructor(protected fb: FormBuilder, private configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.configurator.register('infrastructure', this.form);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      nsiSocketAvailable: [null, Validators.required],
      powerAvailable: [null, Validators.required],
      poeAvailable: [null, Validators.required],
    });
  }
}
