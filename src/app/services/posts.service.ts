import { Injectable, Injector } from '@angular/core';
import { BaseModelService } from './base-model.service';
import enviroment from '../enviroment';
import PostModel from '../models/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService extends BaseModelService{

  constructor(private inj: Injector) {
    super(inj, 'posts')
  }

  getPost(id: number): Observable<PostModel> {
    return this.http.get<PostModel>(enviroment.apiUrl + `posts/${id}`)
  }
}
