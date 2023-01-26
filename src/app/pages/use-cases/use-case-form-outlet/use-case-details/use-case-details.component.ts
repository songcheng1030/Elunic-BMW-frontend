import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DETAILED_REQUEST_TABS, UseCaseConfiguratorService } from 'src/app/shared';
import { TabFormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-details',
  templateUrl: './use-case-details.component.html',
  styleUrls: ['./use-case-details.component.scss'],
})
export class UseCaseDetailsComponent extends TabFormDirective implements OnInit, OnDestroy {
  tabs = DETAILED_REQUEST_TABS;

  constructor(route: ActivatedRoute, configurator: UseCaseConfiguratorService) {
    super(route, configurator);
  }
}
