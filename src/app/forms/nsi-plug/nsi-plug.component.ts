import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { EditorForm, SetupDetailsStep, UseCaseConfiguratorService } from 'src/app/shared';
import { EditorFormDirective } from 'src/app/util';
import { Editor } from 'tinymce';

const DEFAULT_CONTENT = `
<td>
  <p>NSI name:</p>
  <p><br /></p>
  <p>IP-Name:</p>
  <p>IP-Adresse:</p>
  <p>Sub-Network:</p>
  <p>Gateway:</p>
  <p><br /></p>
  <p><strong>Firewall:</strong></p>
  <div>
    <table>
      <tbody>
        <tr>
          <th>Tufin Request ID:</th>
          <td><br /></td>
        </tr>
        <tr>
          <th>Tufin expiration:</th>
          <td><br /></td>
        </tr>
      </tbody>
    </table>
  </div>
</td>
`;

@Component({
  selector: 'app-nsi-plug',
  templateUrl: './nsi-plug.component.html',
  styleUrls: ['./nsi-plug.component.scss'],
})
export class NsiPlugComponent
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
    this.configurator.addEditor('nsi_plug', this.editorComp.editor);

    const { nsiSocketAvailable } = this.configurator.getStep('detailed-request');

    const { nsi } = this.step;
    if (typeof nsi?.content === 'undefined') {
      if (nsiSocketAvailable === true) {
        this.editorComp.writeValue(DEFAULT_CONTENT);
      }
    } else {
      this.editorComp.writeValue(nsi.content);
    }

    (this.editorComp.editor as Editor).setMode(this.form.disabled ? 'readonly' : 'design');
  }
}
