import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import InvitationModel, { InvitationStatus } from '../../models/invitation.model';
import { debounceTime, fromEvent, Subject, Subscription, takeUntil } from 'rxjs';
import { NotificationsService } from '../../services/notifiactions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('notificationRef') notificationRef: ElementRef;
  @Input() notification: InvitationModel;
  resize$: Subscription;
  unsubscribe$ = new Subject<void>();

  size: 'small' | 'medium' | 'large' | null;
  invitationStatus = InvitationStatus;

  constructor(private notificationsService: NotificationsService,
              private toastrService: ToastrService) {

    this.resize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .subscribe(e => {
        this.checkElementWidth();
      })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkElementWidth();
    })
  }

  checkElementWidth() {
    if (this.notificationRef) {
      const elWidth = this.notificationRef.nativeElement.offsetWidth;

      if (elWidth >= 678) this.size = null;
      if (elWidth < 678) this.size = 'medium';
      if (elWidth < 580) this.size = 'small';
    }
  }

  handleInvitation(action: InvitationStatus) {
    const payload = {
      invitation_id: this.notification.id,
      status: action
    }

    this.notificationsService.handleInvitation(payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: value => {
          if (action === InvitationStatus.ACCEPTED) {
            this.toastrService.success('User has been added to your friends')
          }
          this.notification.status = action;
        },
        error: err => {
          this.toastrService.error(err?.error?.message || 'Could not perform action');
          console.log(err);
        }
      })
  }

  ngOnDestroy() {
    this.resize$ && this.resize$.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
