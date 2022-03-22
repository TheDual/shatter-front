import { Injectable, Injector } from '@angular/core';
import { BaseModelService } from './base-model.service';
import InvitationModel, { InvitationStatus, InvitationTypes } from '../models/invitation.model';
import environment from '../enviroment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService extends BaseModelService{
  notifications = new BehaviorSubject<InvitationModel[] | null>(null);

  constructor(private inj: Injector,
              private authService: AuthService) {
    super(inj, 'users/invitations')

    this.authService.user.subscribe(user => {
      if (user) {
        this.loadUserNotReadNotifications(user.id!)
          .subscribe(
          {
            next: notifications => {
              this.notifications.next(notifications);
            },
            error: (err: any) => {
              console.log(err);
            }
          });

      }
    })
  }

  loadUserNotReadNotifications(userId: number): Observable<InvitationModel[]>{
    return this.http.get<InvitationModel[]>(environment.apiUrl + `users/${userId}/invitations/not_read`)
  }

  loadUserNotifications(userId: number, params = {}): Observable<InvitationModel[]> {
    return this.http.get<InvitationModel[]>(environment.apiUrl + `users/${userId}/invitations/`, {params})
  }

  loadInvitationsBetweenUsers(userId: number, params = {}): Observable<{invitations_received: InvitationModel[], invitations_sent: InvitationModel[]}>{
    return this.http.get<{invitations_received: InvitationModel[], invitations_sent: InvitationModel[]}>(environment.apiUrl + `users/${userId}/invitations/between`, {params})
  }

  handleInvitation(data: {invitation_id: number, status: InvitationStatus}) {
    return this.http.patch(environment.apiUrl + 'users/invitations', data);
  }

  createInvitation(data: {to_user: number}) {
    return this.http.post(environment.apiUrl + 'users/invitations', data);
  }

  markNotificationAsRead(notificationId: number) {
    return this.http.patch(environment.apiUrl + `users/invitations/mark_as_read/${notificationId}`, {});
  }

  markAllNotificationsAsRead() {
    return this.http.patch(environment.apiUrl + `users/invitations/mark_as_read`, {});
  }
}
