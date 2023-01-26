import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { INITIAL_REQUEST_TABS, UseCaseConfiguratorService } from 'src/app/shared';
import { TabFormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-create',
  templateUrl: './use-case-create.component.html',
  styleUrls: ['./use-case-create.component.scss'],
})
export class UseCaseCreateComponent extends TabFormDirective {
  tabs = INITIAL_REQUEST_TABS;

  constructor(route: ActivatedRoute, configurator: UseCaseConfiguratorService) {
    super(route, configurator);
  }
}
