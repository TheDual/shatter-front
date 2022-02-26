import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './widgets/navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './pages/main/main.component';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ValdemortModule } from 'ngx-valdemort';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './pages/register/register.component';
import { TokenInterceptor } from './services/token.interceptor';
import { SafeUrlPipe } from './services/safe-url.pipe';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileDataModalComponent } from './widgets/edit-profile-data-modal/edit-profile-data-modal.component';
import { TooltipDirective } from './services/tooltip.directive';
import { UploadDirective } from './services/upload.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { PostComponent } from './widgets/post/post.component';

localStorage.getItem('translate') === 'es' ? registerLocaleData(localeEs) : '';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    SafeUrlPipe,
    ProfileComponent,
    EditProfileDataModalComponent,
    TooltipDirective,
    UploadDirective,
    PostComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ValdemortModule,
    ToastrModule.forRoot(),
    NgbDatepickerModule,
    NgSelectModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: localStorage?.getItem('language') || 'en-US'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
