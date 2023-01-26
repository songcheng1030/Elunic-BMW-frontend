import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OFFER_TABS, UseCaseConfiguratorService } from 'src/app/shared';
import { TabFormDirective } from 'src/app/util';

@Component({
  selector: 'app-use-case-offer',
  templateUrl: './use-case-offer.component.html',
  styleUrls: ['./use-case-offer.component.scss'],
})
export class UseCaseOfferComponent extends TabFormDirective {
  tabs = OFFER_TABS;

  constructor(route: ActivatedRoute, configurator: UseCaseConfiguratorService) {
    super(route, configurator);
  }
}
