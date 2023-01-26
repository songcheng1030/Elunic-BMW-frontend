import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ORDER_TABS, UseCaseConfiguratorService } from 'src/app/shared';
import { TabFormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-ordering',
  templateUrl: './use-case-ordering.component.html',
  styleUrls: ['./use-case-ordering.component.scss'],
})
export class UseCaseOrderingComponent extends TabFormDirective {
  tabs = ORDER_TABS;

  constructor(route: ActivatedRoute, configurator: UseCaseConfiguratorService) {
    super(route, configurator);
  }
}
