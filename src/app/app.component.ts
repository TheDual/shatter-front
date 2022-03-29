import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shatter-front';
  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(['en', 'pl']);
    this.translateService.setDefaultLang(localStorage.getItem('language') || 'en');

    const theme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', theme);
  }
}
