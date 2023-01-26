import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { EditorForm, SetupDetailsStep, UseCaseConfiguratorService } from 'src/app/shared';
import { EditorFormDirective } from 'src/app/util';
import { Editor } from 'tinymce';

const IPS_DEFAULT_CONTENT = `
<table role="grid">
  <thead>
    <tr role="row">
      <th
        style="user-select: none"
        tabindex="0"
        role="columnheader"
        scope="col"
        data-column="0"
        aria-disabled="false"
        aria-sort="none"
        aria-label="IPS-i: No sort applied, activate to apply an ascending sort"
      >
        <div>IPS-i</div>
      </th>
    </tr>
  </thead>

  <tbody aria-live="polite" aria-relevant="all">
    <tr role="row">
      <td>
        <p>AIQX-Station AKZ*:</p>

        <p>TSAP:</p>

        <ul>
          <li>Receiver: AKZ (of AIQX station)</li>

          <li>Sender: IPSI_WAS</li>
        </ul>

        <p>&nbsp;</p>

        <p>*AKZ in local plant nomenclature</p>

        <p>
          for more information see:
          <a
            href="https://atc.bmwgroup.net/confluence/pages/viewpage.action?pageId=774715324"
            target="_blank"
            rel="noopener"
          >
            01_Get Trigger telegramm (IPS-i, LIS-WAS)
          </a>
        </p>
      </td>
    </tr>
  </tbody>
</table>
`;

const PLC_DEFAULT_CONTENT = `
<table role="grid">
  <thead>
    <tr role="row">
      <th
        style="user-select: none"
        tabindex="0"
        role="columnheader"
        scope="col"
        data-column="1"
        aria-disabled="false"
        aria-sort="none"
        aria-label="PLC: No sort applied, activate to apply an ascending sort"
      >
        <div>PLC</div>
      </th>
    </tr>
  </thead>

  <tbody aria-live="polite" aria-relevant="all">
    <tr role="row">
      <td>
        <p>AKZ PLC:</p>

        <p>TSAP:</p>

        <ul>
          <li>Receiver:&nbsp;<span style="color: #172b4d">MONTAIQX</span></li>

          <li>Sender: AKZ (of PLC)</li>
        </ul>

        <p>&nbsp;</p>

        <p>
          <a
            href="https://atc.bmwgroup.net/confluence/pages/viewpage.action?pageId=774715324"
            target="_blank"
            rel="noopener"
          >
            [AIQX] Interface Contract PLC/SPS
          </a>
        </p>
      </td>
    </tr>
  </tbody>
</table>
`;

@Component({
  selector: 'app-ips-plc-trigger',
  templateUrl: './ips-plc-trigger.component.html',
  styleUrls: ['./ips-plc-trigger.component.scss'],
})
export class IpsPlcTriggerComponent
  extends EditorFormDirective<EditorForm>
  implements OnInit, AfterViewInit
{
  private step!: SetupDetailsStep['form'];

  @ViewChild(EditorComponent)
  editorComp!: EditorComponent;

  init = this.configurator.getEditorSettings('setup-details');

  constructor(protected fb: FormBuilder, public configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit(): void {
    // Get existing value of the form before init.
    // If the value is undefined we apply the content templates.
    this.step = this.configurator.getStep('setup-details');

    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.configurator.addEditor('ips_plc_trigger', this.editorComp.editor);

    const { trigger } = this.configurator.getStep('detailed-request');

    if (typeof this.step.ipsPlcTrigger?.content === 'undefined') {
      if (trigger?.value === 'IPS-I') {
        this.editorComp.writeValue(IPS_DEFAULT_CONTENT);
      } else if (trigger?.value === 'SPS/PLC') {
        this.editorComp.writeValue(PLC_DEFAULT_CONTENT);
      } else {
        this.editorComp.writeValue('');
      }
    } else {
      this.editorComp.writeValue(this.step.ipsPlcTrigger.content);
    }

    (this.editorComp.editor as Editor).setMode(this.form.disabled ? 'readonly' : 'design');
  }
}
