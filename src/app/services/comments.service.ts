import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import LikeModel from '../models/like.model';
import enviroment from '../enviroment';
import { BaseModelService } from './base-model.service';
import CommentModel from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService extends BaseModelService{
  constructor(private inj: Injector) {
    super(inj, '')
  }

  vote(commentId: number, value: number): Observable<CommentModel> {
    return this.http.post<CommentModel>(enviroment.apiUrl + `posts/comments/${commentId}/votes`, {vote: value});
  }

  addComment(postId: number, comment: {comment: { content: string}}): Observable<CommentModel> {
    return this.http.post<CommentModel>(enviroment.apiUrl + `posts/${postId}/comments`, comment);
  }
}
