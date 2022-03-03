import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import PostModel from '../../models/post.model';
import { LikesService } from '../../services/likes.service';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommentsService } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr';
import CommentModel from '../../models/comment.model';
import * as moment from 'moment';
import { VoteState } from '../../constants/constants';
import UserModel from '../../models/user.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post: PostModel;
  isShared = false;
  unsubscribe$ = new Subject<void>();
  voteState = VoteState;
  user: UserModel;

  @ViewChild('upArrowRef') upArrowRef: ElementRef;
  @ViewChild('downArrowRef') downArrowRef: ElementRef;
  @ViewChild('commentBody') commentBody: ElementRef;


  constructor(private likesService: LikesService,
              private authService: AuthService,
              private commentsService: CommentsService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.post.comments?.forEach(comment => this.mapCommentDate(comment));
    this.checkIfIsShared();
  }

  checkIfIsShared() {
    this.authService.user
      .subscribe(user => {
        if (user) {
          this.user = user;
          this.isShared = user!.likes.some(like => like.postId === this.post.id);
        }
      })
  }

  mapCommentDate(comment: CommentModel) {
    comment.updated_at = moment(comment['updated_at']).local().format('YYYY-MM-DD HH:mm');
    comment.created_at = moment(comment['created_at']).local().format('YYYY-MM-DD HH:mm');
  }

  onShareClick(target: any) {    console.log(this.upArrowRef);
    this.upArrowRef?.nativeElement?.classList.add('move-up');
    this.downArrowRef?.nativeElement?.classList.add('move-down');

    setTimeout(() => {
      this.upArrowRef?.nativeElement?.classList.remove('move-up');
      this.downArrowRef?.nativeElement?.classList.remove('move-down');
      this.isShared = !this.isShared;
    }, 300);
  }

  toggleLike() {
    this.likesService.toggleLike(this.post.id!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.post.likes = data;
        },
        error: err => {
          console.log(err);
          this.toastrService.error(err?.error?.message || 'Something went wrong');
        }
      })
  }


  handleVote(commentId: number, value: number) {
    this.commentsService.vote(commentId, value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.mapCommentDate(data);
          const modifiedCommentIndex = this.post.comments.findIndex(comment => comment.id === commentId);
          if (modifiedCommentIndex > -1) {
            this.post.comments[modifiedCommentIndex] = data;
          }
        },
        error: err => {
          console.log(err);
          this.toastrService.error(err?.error?.message || 'Something went wrong');
        }
      })
  }

  addComment() {
    const value = {comment: {
      content: this.commentBody?.nativeElement?.textContent
      }
    };

    if (!value.comment.content) return;

    this.commentsService.addComment(this.post.id!, value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: any) => {
          this.commentBody.nativeElement.textContent = '';
          this.mapCommentDate(data);

          data['user'] = {
            first_name: this.user.first_name,
            last_name: this.user.last_name
          };

          this.post.comments.push(data);
        },
        error: err => {
          console.log(err);
          this.toastrService.error(err?.error?.message || 'Something went wrong');
        }
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
