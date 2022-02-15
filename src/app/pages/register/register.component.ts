import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailRegexp, SCREENS } from '../../constants/constants';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  registerForm: FormGroup;

  constructor(private authService: AuthService,
              private toastrService: ToastrService,
              private router: Router) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(emailRegexp)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required])
    });

  }

  ngOnInit(): void {
  }

  submit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: value => {
          console.log(value);
          this.toastrService.success('Success! You may now log in');
          this.router.navigate([SCREENS.LOGIN]);
        },
        error: err => {
          console.log(err);
          this.toastrService.error(err?.error?.message || 'Something went wrong');
        }
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
