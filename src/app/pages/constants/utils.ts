import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export const emailMatchValidator = (email: string): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control && control.parent) {
      return control.value === control.parent.get(email)?.value ? null : {email_mismatch: true};
    } else {
      return null;
    }
  };
}

