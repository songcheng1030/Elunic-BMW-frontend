import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { EditorForm, SetupDetailsStep, UseCaseConfiguratorService } from 'src/app/shared';
import { EditorFormDirective } from 'src/app/util';
import { Editor } from 'tinymce';

const CAMERA_DEFAULT_CONTENT = `
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
        aria-label="Camera: No sort applied, activate to apply an ascending sort"
      >
        <div>Camera</div>
      </th>
    </tr>
  </thead>
  <tbody aria-live="polite" aria-relevant="all">
    <tr role="row">
      <td>
        <div>
          <table>
            <tbody>
              <tr>
                <th>Part/Serial number</th>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <th>Inventory number</th>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  </tbody>
</table>
`;

const EDGE_DEFAULT_CONTENT = `
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
        aria-label="Edge: No sort applied, activate to apply an ascending sort"
      >
        <div>Edge</div>
      </th>
    </tr>
  </thead>
  <tbody aria-live="polite" aria-relevant="all">
    <tr role="row">
      <td>
        <div>
          <table>
            <tbody>
              <tr>
                <th>Part/Serial number</th>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <th>Inventory number</th>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  </tbody>
</table>
`;

const COMBINED_DEFAULT_CONTENT = `
<table role="grid">
  <thead>
    <tr role="row">
      <th
        data-column="0"
        tabindex="0"
        scope="col"
        role="columnheader"
        aria-disabled="false"
        unselectable="on"
        aria-sort="none"
        aria-label="Camera: No sort applied, activate to apply an ascending sort"
        style="user-select: none"
      >
        <div>Camera</div>
      </th>
      <th
        data-column="1"
        tabindex="0"
        scope="col"
        role="columnheader"
        aria-disabled="false"
        unselectable="on"
        aria-sort="none"
        aria-label="Edge: No sort applied, activate to apply an ascending sort"
        style="user-select: none"
      >
        <div>Edge</div>
      </th>
    </tr>
  </thead>
  <tbody aria-live="polite" aria-relevant="all">
    <tr role="row">
      <td>
        <div>
          <table>
            <tbody>
              <tr>
                <th>Part/Serial number</th>
                <td><br /></td>
              </tr>
              <tr>
                <th>Inventory number</th>
                <td><br /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
      <td>
        <div>
          <table>
            <tbody>
              <tr>
                <th>Part/Serial number</th>
                <td><br /></td>
              </tr>
              <tr>
                <th>Inventory number</th>
                <td><br /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  </tbody>
</table>
`;

@Component({
  selector: 'app-hardware-inventory',
  templateUrl: './hardware-inventory.component.html',
  styleUrls: ['./hardware-inventory.component.scss'],
})
export class HardwareInventoryComponent
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
    this.configurator.addEditor('hardware_inventory', this.editorComp.editor);

    const { cameraNecessary, edgeDeviceNecessary } = this.configurator.getStep('offer');

    const { hardwareInventory } = this.step;
    if (typeof hardwareInventory?.content === 'undefined') {
      if (cameraNecessary?.value) {
        if (edgeDeviceNecessary?.value) {
          this.editorComp.writeValue(COMBINED_DEFAULT_CONTENT);
        } else {
          this.editorComp.writeValue(CAMERA_DEFAULT_CONTENT);
        }
      } else if (edgeDeviceNecessary?.value) {
        this.editorComp.writeValue(EDGE_DEFAULT_CONTENT);
      } else {
        this.editorComp.writeValue('');
      }
    } else {
      this.editorComp.writeValue(hardwareInventory.content);
    }

    (this.editorComp.editor as Editor).setMode(this.form.disabled ? 'readonly' : 'design');
  }
}
