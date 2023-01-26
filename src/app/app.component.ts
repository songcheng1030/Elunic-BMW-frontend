import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthService, Lang, SUPPORTED_LANGS } from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private translate: TranslateService) {}

  ngOnInit() {
    this.authService.loadMe();
    // TODO: Get language from user settings.
    const browserLang = (this.translate.getBrowserLang() || 'en').toLowerCase();
    const lang = SUPPORTED_LANGS.includes(browserLang as Lang) ? browserLang : 'en';
    this.translate.use(lang);
  }
}
