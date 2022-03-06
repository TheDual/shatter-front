import { Injectable, Injector } from '@angular/core';
import { BaseModelService } from './base-model.service';
import { Observable } from 'rxjs';
import PostModel from '../models/post.model';
import enviroment from '../enviroment';
import UserModel from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService extends BaseModelService {

  constructor(private inj: Injector) {
    super(inj, 'users/profiles')
  }

  updateProfile(data: any): Observable<UserModel>{
    return this.http.post<UserModel>(enviroment.apiUrl + `users/profiles/`, data)
  }
}
