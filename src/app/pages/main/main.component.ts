import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import * as Buffer from 'buffer';
import PostModel from '../../models/post.model';
import { DomSanitizer } from '@angular/platform-browser';
import { convertToBlob } from '../../constants/utils';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  post: PostModel;

  constructor(private postsService: PostsService) { }

  ngOnInit(): void {
    this.postsService.getPost(7).subscribe((data: PostModel) => {
      // if (data.image?.data?.length) {
      //   data['imageURL'] = URL.createObjectURL(convertToBlob(data.image.data));
      // }
      // this.post = data;
    })
  }


}
