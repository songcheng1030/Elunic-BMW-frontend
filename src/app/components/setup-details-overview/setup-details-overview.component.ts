import { Component, Input } from '@angular/core';
import { clone, isEqual } from 'lodash-es';
import { getStepUrl, SetupDetailsStep, SetupDetailsStepKey, UseCaseDto } from 'src/app/shared';
import { EDITOR_SETTINGS } from 'src/app/util';

interface Editor {
  label: string;
  url: string;
  content: string;
}

const MAP: Record<
  SetupDetailsStepKey,
  {
    label: string;
    url: string;
  }
> = {
  moniker: {
    label: 'FORMS.TITLES.USE_CASE_MONIKER',
    url: getStepUrl('use_case_moniker'),
  },
  nsi: {
    label: 'FORMS.TITLES.NSI_PLUG',
    url: getStepUrl('nsi_plug'),
  },
  ipsPlcTrigger: {
    label: 'FORMS.TITLES.IPS_PLC_TRIGGER',
    url: getStepUrl('ips_plc_trigger'),
  },
  hardwareInventory: {
    label: 'FORMS.TITLES.HARDWARE_INVENTORY',
    url: getStepUrl('hardware_inventory'),
  },
  hardwareSetupImage: {
    label: 'FORMS.TITLES.HARDWARE_SETUP_IMAGE',
    url: getStepUrl('hardware_setup_image'),
  },
  outputSystem: {
    label: 'FORMS.TITLES.OUTPUT_SYSTEM',
    url: getStepUrl('output_system'),
  },
};

@Component({
  selector: 'app-setup-details-overview',
  templateUrl: './setup-details-overview.component.html',
  styleUrls: ['./setup-details-overview.component.scss'],
})
export class SetupDetailsOverviewComponent {
  private form?: Partial<SetupDetailsStep['form']>;

  @Input()
  set formStep(form: Partial<SetupDetailsStep['form']> | undefined) {
    // Init editors only once.
    if (form && !isEqual(form, this.form)) {
      this.form = clone(form);
      this.editors = Object.entries(MAP).map(([key, value]) => ({
        ...value,
        content: form[key as SetupDetailsStepKey]?.content || '',
      }));
    }
  }

  @Input()
  useCase!: UseCaseDto;

  settings = { ...EDITOR_SETTINGS, menubar: false, statusbar: false, toolbar: false };
  editors: Editor[] = [];
}
