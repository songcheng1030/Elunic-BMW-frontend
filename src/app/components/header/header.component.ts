import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import {
  AuthService,
  SearchResultDto,
  SearchService,
  USE_CASE_FORM_NAME_MAP,
  USE_CASE_FORM_STEPS,
  UseCaseFormStep,
} from 'src/app/shared';
import { environment } from 'src/environments/environment';

import { HeaderSearchComponent } from '../header-search/header-search.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  searchMenuOpen = false;
  searchResults?: SearchResultDto[];

  get showRoleDropdown() {
    return environment.production !== true;
  }

  get searchResultFlag() {
    return !!this.searchResults && this.searchResults.length > 0;
  }

  get logoutUrl() {
    return new URL(
      `/self-service/oauth2/sign_out?rd=${encodeURIComponent(
        new URL(
          '/self-service/auth/realms/BMWAIQX/protocol/openid-connect/logout',
          window.location.origin,
        ).href,
      )}`,
      window.location.origin,
    ).href;
  }

  @ViewChild(HeaderSearchComponent, { static: true })
  search!: HeaderSearchComponent;

  constructor(
    public authService: AuthService,
    public searchService: SearchService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  async onSearchEvent(value: string) {
    if (value === '' || value.length < 2) {
      this.searchMenuOpen = false;
      return;
    }

    this.searchMenuOpen = true;
    this.searchResults = await this.searchService.search(value).toPromise();
  }

  switchToRequestor() {
    this.authService.role = 'REQUESTOR';
    this.reloadPage();
  }

  getCurrentStepLabel(searchResult: SearchResultDto) {
    const step = USE_CASE_FORM_NAME_MAP[searchResult.currentStep as UseCaseFormStep] || '';
    return step;
  }

  getStepLabel(step: UseCaseFormStep) {
    return USE_CASE_FORM_NAME_MAP[step] || '';
  }

  getSortedMatchingTypes(searchResult: SearchResultDto) {
    return searchResult.matchingStepTypes.sort(
      (a, b) => USE_CASE_FORM_STEPS.indexOf(a) - USE_CASE_FORM_STEPS.indexOf(b),
    );
  }

  switchToAiqxTeam() {
    this.authService.role = 'AIQX_TEAM';
    this.reloadPage();
  }

  onSetSearch() {
    this.search.reset();
  }

  private reloadPage() {
    (this.document.defaultView || window).location.reload();
  }
}
