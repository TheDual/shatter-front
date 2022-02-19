import { Injectable, Injector } from '@angular/core';
import { BaseModelService } from './base-model.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import UserModel from '../models/user.model';
import enviroment from '../enviroment';
import { convertToBlob } from '../constants/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseModelService {
  user = new BehaviorSubject<UserModel | null>(null);
  tokenChecked = new BehaviorSubject<any>(false);

  constructor(private inj: Injector) {
    super(inj, 'auth')

    if (!this.tokenChecked.value) {
      const token = localStorage.getItem('auth');
      if (token) {
        this.getMe()
          .pipe(map(data => {
            if (data?.profile?.profile_picture?.data) {
              data['profile']['profile_picURL'] = URL.createObjectURL(convertToBlob(data.profile?.profile_picture.data));
            }
            return data;
          }))
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
}
