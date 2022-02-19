import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import UserModel from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { convertBufferToBase64, convertDateToString, convertStringToDate, convertToBase64, convertToBlob } from '../../constants/utils';
import { DATE_CONSTRAINTS, emailRegexp, FILE_TYPES } from '../../constants/constants';
import { EnumsService } from '../../services/enums.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilesService } from '../../services/profiles.service';
import { map, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-profile-data-modal',
  templateUrl: './edit-profile-data-modal.component.html',
  styleUrls: ['./edit-profile-data-modal.component.scss']
})
export class EditProfileDataModalComponent implements OnInit, OnDestroy {
  @ViewChild('datePicker') datePicker: any;
  @HostBinding('id') container = 'modal-container';
  @Input() user: UserModel;
  imageURL: string | null;
  userDataForm: FormGroup;
  dateConstraints = DATE_CONSTRAINTS;
  genderTypes: any[];
  unsubscribe$ = new Subject<void>();


  constructor(private enumsService: EnumsService,
              private activeModal: NgbActiveModal,
              private profilesService: ProfilesService,
              private authService: AuthService,
              private toastrService: ToastrService) {
    this.userDataForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      profile_picture: new FormControl('', []),
      profile_email: new FormControl('', [Validators.pattern(emailRegexp)]),
      gender: new FormControl('', []),
      birth_date: new FormControl('', []),
    })

    this.genderTypes = this.enumsService.getArray(['gender']);
  }

  ngOnInit(): void {
    this.datePicker?.toggle();

    if (this.user) {
      this.userDataForm.patchValue({...this.user, ...this.user.profile});

      const profilePic = this.user.profile?.profile_picture?.data;
      if (profilePic?.length) {
        this.userDataForm.get('profile_picture')?.setValue(convertBufferToBase64(profilePic))
      }

      const dateOfBirth = this.user?.profile?.birth_date;
      if (dateOfBirth) {
        this.userDataForm.get('birth_date')?.setValue(convertStringToDate(dateOfBirth))
      }

      this.imageURL = this.user?.profile?.profile_picURL || null;
    }
  }

  async onFileDropped(data: File) {
    this.imageURL =  URL.createObjectURL(data);
    const fileBuffer = await convertToBase64(data);

    if (fileBuffer) {
      this.userDataForm.get('profile_picture')?.setValue(fileBuffer);
    }
  }

  async onFileUploaded(event: any) {
    const files = event.target.files;

    if(files?.length &&  FILE_TYPES[files[0].type]) {
      await this.onFileDropped(files[0]);
    }
  }

  onDatePickerClick() {
    this.datePicker?.toggle();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  close() {
    this.activeModal.close();
  }

  clearDate() {
    this.userDataForm.get('birth_date')?.setValue(null);
  }

  clearProfilePicture() {
    this.userDataForm.get('profile_picture')?.setValue(null);
    this.imageURL = null;
  }

  submit() {
    this.userDataForm.markAllAsTouched();

    if (this.userDataForm.invalid) return;

    const formData = this.userDataForm.value;
    const payload: any = {};
    if (formData['birth_date']) {
      formData['birth_date'] = convertDateToString(formData['birth_date']);
    }

    payload['user_data'] = {};
    ['first_name', 'last_name'].forEach(key => {
      if (formData[key]) {
        payload['user_data'][key] = formData[key]
        delete formData[key];
      }
    })

    payload['profile'] = formData;

    this.profilesService.updateProfile(payload)
      .pipe(takeUntil(this.unsubscribe$),
            map((data: UserModel) => {
              if (data?.profile?.profile_picture?.data) {
                data['profile']['profile_picURL'] = URL.createObjectURL(convertToBlob(data.profile?.profile_picture.data));
              }
              return data;
      }))
      .subscribe({
        next: data => {
          this.authService.user.next(data);
          this.toastrService.success('Profile data has been changed!');
          this.close();
        },
        error: error => {
          console.log(error);
          this.toastrService.error(error?.error?.message || 'Something went wrong');
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
