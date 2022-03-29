import { Injectable, Injector } from '@angular/core';
import { BaseModelService } from './base-model.service';
import enviroment from '../enviroment';
import ActivityModel from '../models/activity.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService extends BaseModelService {

  constructor(private inj: Injector) {
    super(inj, '');
  }

  getUserActivity(userId: number): Observable<ActivityModel[]> {
    return this.http.get<ActivityModel[]>(enviroment.apiUrl + `users/${userId}/actions`);
  }
}
