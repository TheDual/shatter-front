import { Component, HostListener, OnInit } from '@angular/core';
import { SCREENS } from '../../constants/constants';
import { AuthService } from '../../services/auth.service';
import UserModel from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { convertToBlob } from '../../constants/utils';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  SCREENS = SCREENS;
  user: UserModel | null;
  showDropdown = false;


  @HostListener('window:click', ['$event.target']) clickListener = (event: any) => {
    const checkFor = (className: string) => event.classList.contains(className);
    if (checkFor('first-name-text') || checkFor('menu-item')) return;
    this.showDropdown = false;
  }

  constructor(private authService: AuthService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.authService.user
      .subscribe(data => {
        this.user = data;
      });
  }

  logout() {
    localStorage.removeItem('auth');
    this.authService.user.next(null);
    this.toastrService.success('Logged out');
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

}
