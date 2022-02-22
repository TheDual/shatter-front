import { Component, OnInit } from '@angular/core';
import UserModel from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileDataModalComponent } from '../../widgets/edit-profile-data-modal/edit-profile-data-modal.component';
import { EnumsService } from '../../services/enums.service';
import { DATE_CONSTRAINTS } from '../../constants/constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserModel | null;
  genderTypes: any;

  constructor(private authService: AuthService,
              private modalService: NgbModal,
              private enumsService: EnumsService) {
    this.genderTypes = this.enumsService.getObject(['gender']);
  }

  ngOnInit(): void {
    this.authService.user.subscribe(data => {
      this.user = data;
      console.log(DATE_CONSTRAINTS);
    });
  }

  openEditProfileDataModal() {
    const modalRef = this.modalService.open(EditProfileDataModalComponent, {size: 'lg'});
    modalRef.componentInstance.user = this.user;
    modalRef.result.then(res => {

    }, error => {

    })

  }

}
