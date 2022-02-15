import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import enviroment from '../enviroment';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SCREENS } from '../constants/constants';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {
  }

  addToken(request: HttpRequest<any>): HttpRequest<any> {
    const req = request.clone({});
    let headers = req.headers;

    if (req.url.indexOf('/assets/i18n/') !== -1) return req;
    if (req.url.indexOf(enviroment.apiUrl) === -1) return req;

    const token = localStorage.getItem('auth');
    if (!headers.get('auth') && token) {
      headers = headers.set('auth', token);
    }

    return req.clone({headers});
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addToken(req)).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {

      }
    }, (error: any) => {
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // TODO: clear token data
        }

        if (error.status === 403) {
          this.router.navigate([SCREENS.LOGIN], {queryParams: {returnUrl: window.location.href.replace(window.location.origin, '')}})
        }
      }

    }));
  }
}
