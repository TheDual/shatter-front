import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnumsService {
  enums = new BehaviorSubject<any>({
    gender: [[0, 'Male'], [1, 'Female']]
  });

  constructor() { }

  getRawEnumValues(keys: any) {
    let data = this.enums.value;

    if (!data) {
      return;
    }
    let error = false;
    keys.forEach((key: string) => {
      if (data.hasOwnProperty(key)) {
        data = data[key];
      } else {
        error = true;
      }
    });
    return !error ? data : null;
  }

  getArray(keys: any) {
    let enumValue = this.getRawEnumValues(keys);
    if (!enumValue) return [];
    let ar: any[] = [];
    enumValue.forEach((x: any) => {
      ar.push({ id: x[0], name: x[1] });
    });
    return ar;
  }

  getObject(keys: any) {
    let enumValue = this.getRawEnumValues(keys);
    if (!enumValue) return {};
    let obj: any = {};
    enumValue.forEach((x: any) => {
      obj[x[0]] = x[1];
    });
    return obj;
  }
}
