import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

export const emailMatchValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control && control.parent) {
      return control.value === control.parent.value.email ? null : {email_mismatch: true};
    } else {
      return null;
    }
  };
}

export const passwordMatchValidator = (): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control && control.parent) {
      return control.value === control.parent.value.password ? null : {password_mismatch: true};
    } else {
      return null;
    }
  };
}

export const convertBufferToBase64 = (bytes: Uint8Array): string => {
  let binaryString = '';
  const byteLen = bytes.length;
  for(let i = 0; i < byteLen; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }

  return binaryString;
}

export const convertToBlob = (bytes: Uint8Array): Blob => {
  const binaryString = convertBufferToBase64(bytes);

  return b64toBlob(binaryString);
}

export const b64toBlob = (b64Data: string, contentType='', sliceSize=512): Blob => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: contentType});
}

export const convertToBase64 = (file: File): Promise<string | null> => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
      reject(null);
    }
    reader.onerror = (error: any) => {
      console.log('File read error:', error);
      reject(null)
    }
  })
}

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function isPromise<T>(v: any): v is Promise<T> {
  return v && v.then;
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export const convertDateToString = (date: NgbDateStruct): string => {
  return date ?
    `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
    '';
}

export const convertStringToDate = (date: string): NgbDateStruct => {
  const momentDate = moment(date);

  return {
    year: momentDate.year(),
    month: momentDate.month() + 1,
    day: momentDate.date()
  }
}

export const toFormData = ( formValue: any ) => {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    const value = formValue[key] || '';
    formData.append(key, value);
  }

  return formData;
}


