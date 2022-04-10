import { Component, HostBinding, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import UserModel from '../../models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { convertBufferToBase64, convertDateToString, convertStringToDate, convertToBase64, convertToBlob, toFormData } from '../../constants/utils';
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
      image: new FormControl(undefined, []),
      profile_email: new FormControl('', [Validators.pattern(emailRegexp)]),
      gender: new FormControl('', []),
      birth_date: new FormControl({}),
    })

    this.genderTypes = this.enumsService.getArray(['gender']);
  }

  ngOnInit(): void {
    if (this.user) {
      this.userDataForm.patchValue({...this.user, ...this.user.profile});

      const dateOfBirth = this.user?.profile?.birth_date || null;
      if (dateOfBirth) {
        this.userDataForm.get('birth_date')?.setValue(convertStringToDate(dateOfBirth))
      } else {
        this.userDataForm.get('birth_date')?.setValue(dateOfBirth)
      }

      this.imageURL = this.user?.profile?.image?.file_path || null;
    }
  }

  async onFileDropped(data: File) {

    if (data) {
      this.imageURL =  URL.createObjectURL(data);
      this.userDataForm.get('image')?.setValue(data);
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
    this.userDataForm.get('image')?.setValue('null');
    this.imageURL = null;
  }

  submit() {
    this.userDataForm.markAllAsTouched();
    console.log(this.userDataForm);
    if (this.userDataForm.invalid) return;

    const payload = this.userDataForm.value;
    if (payload['birth_date']) {
      payload['birth_date'] = convertDateToString(payload['birth_date']);
    }

    payload['user_data'] = {};
    ['first_name', 'last_name'].forEach(key => {
      if (payload[key]) {
        payload['user_data'][key] = payload[key]
        delete payload[key];
      }
    })

    payload['user_data'] = JSON.stringify(payload['user_data']);
    console.log(payload);
    const formData = toFormData(payload);
    this.profilesService.updateProfile(formData)
      .pipe(takeUntil(this.unsubscribe$))
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
