import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import * as Buffer from 'buffer';
import PostModel from '../../models/post.model';
import { DomSanitizer } from '@angular/platform-browser';
import { convertToBlob } from '../../constants/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddOrEditPostModalComponent } from '../../widgets/add-or-edit-post-modal/add-or-edit-post-modal.component';
import { map, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import UserModel from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  posts: PostModel[];
  unsubscribe$ = new Subject<void>();
  user: UserModel;

  constructor(private postsService: PostsService,
              private modalService: NgbModal,
              private toastrService: ToastrService,
              private authService: AuthService) {
    this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    })
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  addPost() {
    const modalRef = this.modalService.open(AddOrEditPostModalComponent, {size: 'md'})
    modalRef.result
      .then(res => {
        if (res?.success) {
          this.posts.unshift(res.post);
        }
      })
      .catch(err => {
        console.log('Adding post error', err);
      })
  }

  loadPosts() {
    this.postsService.getPostsFromMe()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.posts = data;
          console.log(this.posts);
        },
        error: err => {
          this.toastrService.error(err?.error?.message || 'Something went wrong')
        }
      })
  }

  onPostDeleted(postId: number) {
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex > -1) this.posts.splice(postIndex, 1);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
