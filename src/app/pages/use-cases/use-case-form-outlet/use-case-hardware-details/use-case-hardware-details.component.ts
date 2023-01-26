import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HardwareDetailsForm, UseCaseConfiguratorService, UseCaseDto } from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-hardware-details',
  templateUrl: './use-case-hardware-details.component.html',
  styleUrls: ['./use-case-hardware-details.component.scss'],
})
export class UseCaseHardwareDetailsComponent
  extends FormDirective<HardwareDetailsForm, UseCaseDto>
  implements OnInit
{
  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.configurator.register('hardware_details', this.form);
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      ipName: [null],
      ipAddress: [null],
      subNetwork: [null],
      gateway: [null],
      cameraPartNumber: [null],
      cameraInventoryNumber: [null],
    });
  }
}
