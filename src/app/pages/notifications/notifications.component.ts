import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifiactions.service';
import InvitationModel from '../../models/invitation.model';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import UserModel from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: InvitationModel[];
  unsubscribe$ = new Subject<void>();

  constructor(private notificationsService: NotificationsService,
              private authService: AuthService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.loadNotifications(user.id!);
      }
    })
  }

  loadNotifications(userId: number) {
    this.notificationsService.loadUserNotifications(userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: notifications => {
          this.notifications = notifications;
          this.markAllNotificationsAsRead();
        },
        error: err => {
          console.log(err);
          this.toastrService.error(err?.error?.message || 'Could not load user notifications')
        }
      })
  }

  markAllNotificationsAsRead() {
    this.notificationsService.markAllNotificationsAsRead()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          this.notificationsService.notifications.next(null);
        },
        error: err => {
          this.toastrService.error(err?.error?.message || 'Could not mark notifications as read');
          console.log(err);
        }
      });
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
