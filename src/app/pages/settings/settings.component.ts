import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  languages = [
    {id: 0, code: 'en', name: 'English'},
    {id: 1, code: 'pl', name: 'Polski'},
  ];

  themes: {id: number, value: string, name: string}[] = [];

  currentLanguage: any;
  currentTheme: any;

  constructor(private translateService: TranslateService,
              private toastrService: ToastrService) {
    const language = localStorage.getItem('language') || 'en';
    this.currentLanguage = this.languages.find(l => l.code === language);

    this.themes = [
      {id: 0, value: 'dark', name: this.translateService.instant('labels.dark')},
      {id: 1, value: 'light', name: this.translateService.instant('labels.light')},
    ];

    const theme = document.body.getAttribute('data-theme') || 'dark';
    this.currentTheme = this.themes.find(t => t.value === theme);
  }

  ngOnInit() {
  }

  onSettingsSave() {
    localStorage.setItem('language', this.currentLanguage.code);
    this.translateService.use(this.currentLanguage.code);

    localStorage.setItem('theme', this.currentTheme.value);
    document.body.setAttribute('data-theme', this.currentTheme.value);

    this.toastrService.success('Settings saved!');
  }

  restoreDefault() {
    this.currentLanguage = this.languages[0];
    this.currentTheme = this.themes[0];
    this.onSettingsSave();
  }
}
