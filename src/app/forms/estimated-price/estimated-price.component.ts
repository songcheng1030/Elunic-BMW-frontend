import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EstimatedPriceForm, UseCaseConfiguratorService } from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-estimated-price',
  templateUrl: './estimated-price.component.html',
  styleUrls: ['./estimated-price.component.scss'],
})
export class EstimatedPriceComponent extends FormDirective<EstimatedPriceForm> implements OnInit {
  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configurator.register('estimated_price', this.form);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({});
  }
}
