import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { EditorForm, SetupDetailsStep, UseCaseConfiguratorService } from 'src/app/shared';
import { EditorFormDirective } from 'src/app/util';
import { Editor } from 'tinymce';

const DEFAULT_CONTENT = `
<table>
  <tbody>
    <tr>
      <th colspan="1">AKZ (AIQX station)*:</th>
      <td colspan="1">see D0</td>
    </tr>
    <tr>
      <th colspan="1">BlockID*:</th>
      <td colspan="1"><br /></td>
    </tr>
    <tr>
      <th>Feature Name**:</th>
      <td><br /></td>
    </tr>
    <tr>
      <th>Feature ID**:</th>
      <td><br /></td>
    </tr>
  </tbody>
</table>
`;

@Component({
  selector: 'app-output-system',
  templateUrl: './output-system.component.html',
  styleUrls: ['./output-system.component.scss'],
})
export class OutputSystemComponent
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
    this.configurator.addEditor('output_system', this.editorComp.editor);

    const { validationResult } = this.configurator.getStep('detailed-request');

    const { outputSystem } = this.step;
    if (typeof outputSystem?.content === 'undefined') {
      if (validationResult?.value === 'IPS-Q') {
        this.editorComp.writeValue(DEFAULT_CONTENT);
      }
    } else {
      this.editorComp.writeValue(outputSystem.content);
    }

    (this.editorComp.editor as Editor).setMode(this.form.disabled ? 'readonly' : 'design');
  }
}
