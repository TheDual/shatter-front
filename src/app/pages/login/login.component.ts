import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { map, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { emailRegexp, SCREENS } from '../../constants/constants';
import { ToastrService } from 'ngx-toastr';
import { convertToBlob } from '../../constants/utils';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  loginForm: FormGroup;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private toastrService: ToastrService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(emailRegexp)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  ngOnInit(): void {
  }

  submit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: data => {
          localStorage.setItem('auth', data.token);
          this.authService.user.next(data.user);
          const returnURL = this.route.snapshot.queryParams['returnUrl'] || null;

          if (returnURL) window.location.href = returnURL;
          else this.router.navigate([SCREENS.MAIN]);

          this.toastrService.success('Logged in!');
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
