import { Injectable, Injector } from '@angular/core';
import { BaseModelService } from './base-model.service';
import enviroment from '../enviroment';
import { Observable } from 'rxjs';
import LikeModel from '../models/like.model';

@Injectable({
  providedIn: 'root'
})
export class LikesService extends BaseModelService {

  constructor(private inj: Injector) {
    super(inj, '')
  }

  toggleLike(postId: number): Observable<LikeModel[]> {
    return this.http.post<LikeModel[]>(enviroment.apiUrl + `posts/${postId}/likes`, {});
  }
}
