import { Component, HostListener, OnInit } from '@angular/core';
import { SCREENS } from '../../constants/constants';
import { AuthService } from '../../services/auth.service';
import UserModel from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { convertToBlob } from '../../constants/utils';
import { map } from 'rxjs';
import { NotificationsService } from '../../services/notifiactions.service';
import InvitationModel from '../../models/invitation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  SCREENS = SCREENS;
  user: UserModel | null;
  showDropdown = false;
  notifications: InvitationModel[] | null;


  @HostListener('window:click', ['$event.target']) clickListener = (event: any) => {
    const checkFor = (className: string) => event.classList.contains(className);
    if (checkFor('first-name-text') || checkFor('menu-item')) return;
    this.showDropdown = false;
  }

  constructor(private authService: AuthService,
              private toastrService: ToastrService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit(): void {
    this.authService.user
      .subscribe(data => {
        this.user = data;
      });

    this.notificationsService.notifications.subscribe(notifications => {
      this.notifications = notifications;
      console.log(this.notifications);
    })
  }

  logout() {
    this.authService.logout();
  }

  toggleDropdown(event: any) {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

}
