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

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  posts: PostModel[];
  unsubscribe$ = new Subject<void>();

  constructor(private postsService: PostsService,
              private modalService: NgbModal,
              private toastrService: ToastrService) { }

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
    this.postsService.getList<PostModel>()
      .pipe(takeUntil(this.unsubscribe$),
            map(posts => {
              posts.forEach(post => {
                if (post.image?.data?.length) {
                  post['imageURL'] = URL.createObjectURL(convertToBlob(post.image?.data));
                }
                post['created_at'] = moment(post['created_at']).local().format('YYYY-MM-DD HH:mm');
                post['updated_at'] = moment(post['updated_at']).local().format('YYYY-MM-DD HH:mm');

                if (post.user.profile?.profile_picture?.data?.length) {
                  post.user.profile['profile_picURL'] = URL.createObjectURL(convertToBlob(post.user.profile?.profile_picture?.data));
                }
              })

              return posts;
            })
      )
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

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
