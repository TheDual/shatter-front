import { Injectable, Injector } from '@angular/core';
import { BaseModelService } from './base-model.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import UserModel from '../models/user.model';
import enviroment from '../enviroment';
import { convertToBlob } from '../constants/utils';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SCREENS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseModelService {
  user = new BehaviorSubject<UserModel | null>(null);
  tokenChecked = new BehaviorSubject<any>(false);

  constructor(private inj: Injector,
              private toastrService: ToastrService,
              private router: Router) {
    super(inj, 'auth')

    if (!this.tokenChecked.value) {
      const token = localStorage.getItem('auth');
      if (token) {
        this.getMe()
          .subscribe({
            next: data => {
              this.user.next(data);
              this.tokenChecked.next(true);
            },
            error: err => {
              console.log(err);
              localStorage.removeItem('auth')
              this.user.next(null);
              this.tokenChecked.next(true);
            }
          })
      } else {
        localStorage.removeItem('auth')
        this.user.next(null);
        this.tokenChecked.next(true);
      }
    }

  }


  login(data: {email: string, password: string}): Observable<{token: string, user: UserModel}> {
    return this.http.post<{token: string, user: UserModel}>(enviroment.apiUrl + 'auth/login', data);
  }

  register(data: Object) {
    return this.http.post(enviroment.apiUrl + 'auth/register', data);
  }

  getMe(): Observable<UserModel> {
    return this.http.get<UserModel>(enviroment.apiUrl + 'auth/get_me');
  }

  logout() {
    localStorage.removeItem('auth');
    this.user.next(null);
    this.toastrService.success('Logged out');
    this.router.navigate([SCREENS.LOGIN]);
  }
}
