import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import environment from '../enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseModelService {
  http: HttpClient;

  constructor(private injectorObj: Injector, @Inject(String) private readonly url: string) {
    this.http = this.injectorObj.get(HttpClient);
    this.url = url || '';
  }

  getList<T>(params: Object = {}): Observable<T[]> {
    return this.http.get<T[]>(environment.apiUrl + this.url + '?', params);
  }

  postList<T>(data: T[]): Observable<T[]> {
    return this.http.post<T[]>(environment.apiUrl + this.url, data);
  };

  /**
   * Details
   */
  getDetail<T>(id: number): Observable<T> {
    return this.http.get<T>(environment.apiUrl + this.url + id + '/');
  };

  postDetail<T>(id: number, data: T): Observable<T> {
    return this.http.post<T>(environment.apiUrl + this.url + `/${id}/`, data);
  };

  patchDetail<T>(id: number, data: T): Observable<T> {
    return this.http.patch<T>(environment.apiUrl + this.url + `/${id}/`, data);
  };

  putDetail<T>(id: number, data: T): Observable<T> {
    return this.http.put<T>(environment.apiUrl + this.url + `/${id}/`, data);
  };

  deleteDetail<T>(id: number): Observable<T> {
    return this.http.delete<T>(environment.apiUrl + this.url + `/${id}/`);
  };

}
