import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import PostModel from '../../models/post.model';
import { LikesService } from '../../services/likes.service';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommentsService } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr';
import CommentModel from '../../models/comment.model';
import * as moment from 'moment';
import { SCREENS, VoteState } from '../../constants/constants';
import UserModel from '../../models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddOrEditPostModalComponent } from '../add-or-edit-post-modal/add-or-edit-post-modal.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post: PostModel;
  @Output() postDeleted = new EventEmitter<number>();
  unsubscribe$ = new Subject<void>();
  SCREENS = SCREENS;
  voteState = VoteState;
  user: UserModel;

  @ViewChild('upArrowRef') upArrowRef: ElementRef;
  @ViewChild('downArrowRef') downArrowRef: ElementRef;
  @ViewChild('commentBody') commentBody: ElementRef;


  constructor(private likesService: LikesService,
              private authService: AuthService,
              private commentsService: CommentsService,
              private toastrService: ToastrService,
              private modalService: NgbModal,
              private postsService: PostsService) {

    this.authService.user
      .subscribe(user => {
        if (user) {
          this.user = user;
        }
      })
  }

  ngOnInit(): void {
    if (!this.post) return;

    this.mapDate(this.post);
    this.post.comments?.forEach(comment => this.mapDate(comment));
  }

  mapDate(obj: any, keys = ['updated_at', 'created_at']) {
    keys.forEach(key => {
      if (obj[key]) {
        obj[key] = moment(obj[key]).local().format('YYYY-MM-DD HH:mm');
      }
    });
  }

  onShareClick(target: any) {
    this.upArrowRef?.nativeElement?.classList.add('move-up');
    this.downArrowRef?.nativeElement?.classList.add('move-down');

    setTimeout(() => {
      this.upArrowRef?.nativeElement?.classList.remove('move-up');
      this.downArrowRef?.nativeElement?.classList.remove('move-down');
      this.post.is_shared = !this.post.is_shared;
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
          this.mapDate(data);
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
          this.mapDate(data);
          this.post.comments.push(data);
        },
        error: err => {
          console.log(err);
          this.toastrService.error(err?.error?.message || 'Something went wrong');
        }
      })
  }

  editPost() {
    const modalRef = this.modalService.open(AddOrEditPostModalComponent, {size: 'md'});
    modalRef.componentInstance.id = this.post.id;
    modalRef.componentInstance.post = this.post;

    modalRef.result.then(res => {
      if (res?.success && res?.post) {
        this.post = res.post;
        this.post.comments?.forEach(comment => this.mapDate(comment));
      }
    }, err => {})
  }

  deletePost() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {size: 'md'});
    modalRef.componentInstance.text = 'Do you really want to delete this post?';

    modalRef.result.then(res => {
      if (res?.success) {
        this.postsService.deleteDetail<PostModel>(this.post.id!)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: data => {
              this.postDeleted.emit(this.post.id);
            },
            error: err => {
              console.log(err);
              this.toastrService.error(err?.error?.message || 'Could not delete post')
            }
          })
      }
    }, err => {})
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
