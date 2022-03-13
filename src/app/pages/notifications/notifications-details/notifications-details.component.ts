import { Component, OnDestroy, OnInit } from '@angular/core';
import InvitationModel from '../../../models/invitation.model';
import { NotificationsService } from '../../../services/notifiactions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SCREENS } from '../../../constants/constants';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications-details',
  templateUrl: './notifications-details.component.html',
  styleUrls: ['./notifications-details.component.scss']
})
export class NotificationsDetailsComponent implements OnInit, OnDestroy {
  notification: InvitationModel;
  id: number;
  unsubscribe$ = new Subject<void>();


  constructor(private notificationsService: NotificationsService,
              private router: Router,
              private route: ActivatedRoute,
              private toastrService: ToastrService) {

    this.id = +this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadNotificationDetails();
  }

  loadNotificationDetails() {
    if (this.id) {
      this.notificationsService.getDetail<InvitationModel>(this.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: data => {
            data['created_at'] = moment(data['created_at']).local().format('YYYY-MM-DD HH:mm');
            this.notification = data;

            if (!this.notification.is_read) {
              this.markNotificationAsRead();
            }
          },
          error: err => {
            this.toastrService.error(err?.error?.message || 'Could not load notification');
            console.log(err);
            this.router.navigate([SCREENS.MAIN]);
          }
        })
    }
  }

  markNotificationAsRead() {
    this.notificationsService.markNotificationAsRead(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          const notifications = this.notificationsService.notifications?.value?.filter(x => x.id !== this.id);
          if (notifications) {
            this.notificationsService.notifications.next(notifications);
          }
        },
        error: err => {
          this.toastrService.error(err?.error?.message || 'Could not mark notification as read');
          console.log(err);
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
