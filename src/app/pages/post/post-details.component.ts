import { Component, OnDestroy, OnInit } from '@angular/core';
import PostModel from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit, OnDestroy {
  post: PostModel;
  id: number;
  unsubscribe$ = new Subject<void>();

  constructor(private postsService: PostsService,
              private route: ActivatedRoute) {
    this.id = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.id) {
      this.loadPostDetails();
    }
  }

  loadPostDetails() {
    this.postsService.getPost(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(post => {
        this.post = post;
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
