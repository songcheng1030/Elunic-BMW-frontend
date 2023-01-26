import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  SETUP_DETAILS_STEPS,
  SETUP_DETAILS_TABS,
  SetupDetailsStepKey,
  UseCaseConfiguratorService,
} from 'src/app/shared';
import { TabFormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-setup-details',
  templateUrl: './use-case-setup-details.component.html',
  styleUrls: ['./use-case-setup-details.component.scss'],
})
export class UseCaseSetupDetailsComponent extends TabFormDirective implements OnInit {
  tabs = SETUP_DETAILS_TABS;

  formMap = Object.values(SETUP_DETAILS_STEPS).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: this.fb.group({
        [curr]: this.fb.group({
          content: [''],
          checked: [false, Validators.requiredTrue],
        }),
      }),
    }),
    {} as Record<SetupDetailsStepKey, FormGroup>,
  );

  constructor(
    route: ActivatedRoute,
    public configurator: UseCaseConfiguratorService,
    private fb: FormBuilder,
  ) {
    super(route, configurator);
  }

  ngOnInit() {
    super.ngOnInit();

    // Contrary to other step components, we register the forms her and not in the tab components.
    // This is because tinymce has problems with the angular material tab.
    // The tabs must be lazy loaded so tinymce can attach to the dom.
    // https://github.com/tinymce/tinymce-angular/issues/105
    // But because the are lazy loaded, the forms will only be inited once the user navigates there once.
    // This will result in the form step being valid even though some sub step is not (because it has no change to
    // register its form in the ngOnInit hook).
    // Here we register all sub steps as they would have been if they could fire ngOnInit themselves.
    this.configurator.register('use_case_moniker', this.getSubForm('moniker'));
    this.configurator.register('nsi_plug', this.getSubForm('nsi'));
    this.configurator.register('ips_plc_trigger', this.getSubForm('ipsPlcTrigger'));
    this.configurator.register('hardware_inventory', this.getSubForm('hardwareInventory'));
    this.configurator.register('hardware_setup_image', this.getSubForm('hardwareSetupImage'));
    this.configurator.register('output_system', this.getSubForm('outputSystem'));
  }

  private getSubForm(step: SetupDetailsStepKey) {
    return this.formMap[step];
  }
}
