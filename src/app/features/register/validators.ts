import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function matchValidator(password: string, confirmPassword: string): ValidatorFn {
    return (passwordGroup: AbstractControl): ValidationErrors | null => {
        const passwordControl = passwordGroup.get(password);
        const confirmPasswordControl = passwordGroup.get(confirmPassword)

        return passwordControl && 
          confirmPasswordControl &&
          passwordControl.value !== confirmPasswordControl.value ? 
          {'mismatch': true} 
          : null

    }
}