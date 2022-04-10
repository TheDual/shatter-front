import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { ToastrService } from 'ngx-toastr';
import { SCREENS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  SCREENS = SCREENS;

  constructor(private router: Router,
              private authService: AuthService,
              private toastrService: ToastrService) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let promise = new Promise<boolean>((resolve, reject) => {

      const token = localStorage.getItem('auth')
      if (!token) {
        this.toastrService.error('This action requires you to be logged it.');
        this.router.navigate([SCREENS.LOGIN], {queryParams: {returnUrl: state.url}});
        resolve(true);
        return;
      }

      if (this.authService.user.value) {
        resolve(true);
        return;
      } else {
        this.authService.getMe().subscribe({
          next: user => {
            if (user) {
              this.authService.user.next(user);
              resolve(true);
            }
          },
          error: err => {
            console.log(err);
            this.toastrService.error(err?.error?.message || 'Could not get user');
            this.authService.logout();
            resolve(false);
          }
        })
      }
    });

    return promise;
  }
}
