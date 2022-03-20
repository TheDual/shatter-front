import { Injectable, Injector } from '@angular/core';
import { BaseModelService } from './base-model.service';
import { Observable } from 'rxjs';
import UserModel from '../models/user.model';
import enviroment from '../enviroment';
import PostModel from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseModelService{

  constructor(private inj: Injector) {
    super(inj, 'users/')
  }


  getUserFriends(id: number): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(enviroment.apiUrl + `users/${id}/friends`);
  }

  getUserPosts(id: number): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(enviroment.apiUrl + `users/${id}/posts`);
  }

}
