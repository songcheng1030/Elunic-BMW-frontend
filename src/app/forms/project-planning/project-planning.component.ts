import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  PROJECT_PLANNING_GROUPS,
  ProjectFunction,
  ProjectPlanningForm,
  UseCaseConfiguratorService,
  UseCaseDto,
} from 'src/app/shared';
import { FormDirective } from 'src/app/util';

@Component({
  selector: 'app-project-planning',
  templateUrl: './project-planning.component.html',
  styleUrls: ['./project-planning.component.scss'],
})
export class ProjectPlanningComponent
  extends FormDirective<ProjectPlanningForm, UseCaseDto>
  implements OnInit
{
  private controlsMap: { [key in ProjectFunction]?: keyof ProjectPlanningForm } = {
    PSP: 'psp',
    'Plant planner': 'planner',
    'Process planner': 'planner',
    Section: 'section',
    QE: 'qe',
  };

  groups = PROJECT_PLANNING_GROUPS;

  constructor(protected fb: FormBuilder, private configurator: UseCaseConfiguratorService) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.configurator.register('project_planning', this.form);

    const reqCtrl = this.form.controls.requestor;

    let lastFuncName = reqCtrl.value?.function?.name as ProjectFunction | undefined;
    reqCtrl.valueChanges.subscribe(value => {
      const funcName = value.function.name as ProjectFunction | undefined;
      if (!funcName) {
        return;
      }

      const ctrlName = this.controlsMap[funcName];
      if (!ctrlName) {
        return;
      }

      const ctrl = this.form.controls[ctrlName];
      if (ctrl && funcName !== lastFuncName) {
        ctrl.patchValue({ ...value });
        lastFuncName = funcName;
      }
    });
  }

  protected buildForm(): FormGroup {
    return this.fb.group({
      completionDate: [null, Validators.required],
      requestor: [null, Validators.required],
      planner: [null],
      psp: [null],
      qe: [null],
      section: [null],
    });
  }
}
