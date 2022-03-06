import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { convertDateToString, convertToBase64, convertToBlob, toFormData } from '../../constants/utils';
import { map, Subject, takeUntil } from 'rxjs';
import UserModel from '../../models/user.model';
import { EnumsService } from '../../services/enums.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilesService } from '../../services/profiles.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FILE_TYPES } from '../../constants/constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import PostModel from '../../models/post.model';
import { PostsService } from '../../services/posts.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-or-edit-post-modal',
  templateUrl: './add-or-edit-post-modal.component.html',
  styleUrls: ['./add-or-edit-post-modal.component.scss']
})
export class AddOrEditPostModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() post?: PostModel;
  unsubscribe$ = new Subject<void>();
  postForm: FormGroup;
  imageURL: string | null;
  content: string;

  constructor(private enumsService: EnumsService,
              private activeModal: NgbActiveModal,
              private postsService: PostsService,
              private toastrService: ToastrService) {

    this.postForm = new FormGroup({
      image: new FormControl(null),
      content: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if (this.id && this.post) {
      this.postForm.patchValue(this.post);
      this.imageURL = this.post?.image?.file_path || null;
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  close(result?: {success: boolean, post?: PostModel}) {
    this.activeModal.close(result);
  }


  async onFileUploaded(data: any) {
    const files = data?.target?.files;
    const file = files?.length && FILE_TYPES[files[0].type] ? files[0] : data || null;

    if (!file) return;

    this.imageURL = URL.createObjectURL(file);
    this.postForm.get('image')?.patchValue(file);
  }

  submit() {
    this.postForm.markAllAsTouched();
    if (this.postForm.invalid) return;

    const formData = toFormData(this.postForm.value);

    let req = this.id ? this.postsService.patchDetail<typeof formData>(this.id, formData) : this.postsService.addPost<typeof formData>(formData);

    req.pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: any) => {
          this.toastrService.success(`Post ${this.id ? 'edited' : 'added'} successfully!`)

          data['created_at'] = moment(data['created_at']).local().format('YYYY-MM-DD HH:mm');
          data['updated_at'] = moment(data['updated_at']).local().format('YYYY-MM-DD HH:mm');

          this.close({success: true, post: data});
        },
        error: (err: any) => {
          console.log(err);
          this.toastrService.error(err.error?.message || 'Something went wrong');
        }
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
