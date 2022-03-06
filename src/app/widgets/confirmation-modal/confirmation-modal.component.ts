import { Component, Input, OnInit } from '@angular/core';
import PostModel from '../../models/post.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @Input() text: string;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  dismiss() {
    this.activeModal.dismiss();
  }

  close(result?: {success: boolean}) {
    this.activeModal.close(result);
  }

  confirm() {
    this.activeModal.close({success: true})
  }
}
