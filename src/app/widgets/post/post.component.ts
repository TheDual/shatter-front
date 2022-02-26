import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  isShared = false;
  constructor() { }

  ngOnInit(): void {
  }

  onShareClick(target: any) {
    const upElRef = document.getElementById('up');
    const downElRef = document.getElementById('down');

    upElRef?.classList.add('move-up');
    downElRef?.classList.add('move-down');

    setTimeout(() => {
      upElRef?.classList.remove('move-up');
      downElRef?.classList.remove('move-down');
      this.isShared = !this.isShared;
    }, 300);
  }

}