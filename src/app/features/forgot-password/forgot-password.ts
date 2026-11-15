import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ErrorMsg } from '../../shared/components/error-msg/error-msg';
import { AuthService } from '../../core/services/user-services/auth-service';
import { ErrorService } from '../../core/services/error-service';
import { AppRoutes } from '../../core/enums/app-routes.enum';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, ErrorMsg],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private auth = inject(AuthService);
  private errorServ = inject(ErrorService);
  private router = inject(Router);

  public step = signal<1 | 2>(1);
  public loading = signal(false);
  public success = signal(false);
  private userId: string | null = null;

  public verifyForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?:\+?995\s?)?5\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}$/),
    ]),
  });

  public passwordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}$')
    ]),
  });

  public verify(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { email, mobile } = this.verifyForm.getRawValue();

    this.auth.verifyUser(email!, mobile!).subscribe({
      next: (id) => {
        this.loading.set(false);
        if (id) {
          this.userId = id;
          this.step.set(2);
        } else {
          this.errorServ.setErrorMsg('მომხმარებელი ამ მონაცემებით ვერ მოიძებნა');
          this.errorServ.clearMsg();
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorServ.setErrorMsg('დაფიქსირდა შეცდომა, სცადეთ თავიდან');
        this.errorServ.clearMsg();
      },
    });
  }

  public savePassword(): void {
    if (this.passwordForm.invalid || !this.userId) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const password = this.passwordForm.getRawValue().password!;

    this.auth.resetPassword(this.userId, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigateByUrl(AppRoutes.Login), 2000);
      },
      error: () => {
        this.loading.set(false);
        this.errorServ.setErrorMsg('პაროლის შეცვლა ვერ მოხერხდა');
        this.errorServ.clearMsg();
      },
    });
  }

  public get emailControl(): FormControl {
    return this.verifyForm.get('email') as FormControl;
  }
  public get mobileControl(): FormControl {
    return this.verifyForm.get('mobile') as FormControl;
  }
  public get passwordControl(): FormControl {
    return this.passwordForm.get('password') as FormControl;
  }
}