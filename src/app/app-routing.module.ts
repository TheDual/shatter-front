import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { NotificationsDetailsComponent } from './pages/notifications/notifications-details/notifications-details.component';
import { RouteGuard } from './services/route-guard.service';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: 'main',
    canActivate: [RouteGuard],
    component: MainComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    canActivate: [RouteGuard],
    children: [
      {
        path: '',
        component: ProfileComponent
      },
      {
        path: ':id',
        component: ProfileComponent
      }
    ]
  },
  {
    path: 'notifications',
    canActivate: [RouteGuard],
    children: [
      {
        path: '',
        component: NotificationsComponent
      },
      {
        path: ':id',
        component: NotificationsDetailsComponent
      }
    ]
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: '**',
    redirectTo: '/main',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
