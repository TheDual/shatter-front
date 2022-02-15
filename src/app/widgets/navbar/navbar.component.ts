import { Component, OnInit } from '@angular/core';
import { SCREENS } from '../../constants/constants';
import { AuthService } from '../../services/auth.service';
import UserModel from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  SCREENS = SCREENS;
  user: UserModel | null;
  constructor(private authService: AuthService,
              private toastrService: ToastrService) {

  }

  ngOnInit(): void {
    this.authService.user.subscribe(data => {
      console.log(data);
      this.user = data;
    })
  }

  logout() {
    localStorage.removeItem('auth');
    this.authService.user.next(null);
    this.toastrService.success('Logged out');
  }

}
