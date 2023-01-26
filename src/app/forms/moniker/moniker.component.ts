import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { EditorForm, SetupDetailsStep, UseCaseConfiguratorService } from 'src/app/shared';
import { EditorFormDirective } from 'src/app/util';
import { Editor } from 'tinymce';

@Component({
  selector: 'app-moniker',
  templateUrl: './moniker.component.html',
  styleUrls: ['./moniker.component.scss'],
})
export class MonikerComponent
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
    this.configurator.addEditor('use_case_moniker', this.editorComp.editor);

    const { moniker } = this.step;
    this.editorComp.writeValue(moniker?.content || '');

    (this.editorComp.editor as Editor).setMode(this.form.disabled ? 'readonly' : 'design');
  }
}
