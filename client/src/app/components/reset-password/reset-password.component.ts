import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ResetPasswordService } from '../../services/resetPassword.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ResetPosswordInfo } from '../../models/ResetPosswordInfo';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private resetPassword: ResetPasswordService,
    private message: NzMessageService,
    private token: TokenService
  ) { }

  setpOneValidateForm: FormGroup;
  setpTwoValidateForm: FormGroup;
  resetPosswordInfo: ResetPosswordInfo;
  email: string;
  isSubmitting = false;
  isGettingCaptcha = false;
  getCaptchaBtnStr = 'Get captcha';
  notify = '';
  stepIndex = 0;

  submitForm(step: number): void {
    if (step === 0) {
      // tslint:disable-next-line:forin
      for (const i in this.setpOneValidateForm.controls) {
        this.setpOneValidateForm.controls[i].markAsDirty();
        this.setpOneValidateForm.controls[i].updateValueAndValidity();
      }
      if (this.setpOneValidateForm.valid && !this.isSubmitting) {
        this.isSubmitting = true;
        this.checkUser();
      }
    } else if (step === 1) {
      // tslint:disable-next-line:forin
      for (const i in this.setpTwoValidateForm.controls) {
        this.setpTwoValidateForm.controls[i].markAsDirty();
        this.setpTwoValidateForm.controls[i].updateValueAndValidity();
      }
      if (this.setpTwoValidateForm.valid && !this.isSubmitting) {
        this.isSubmitting = true;
        this.resetPosswordInfo = {
          email: this.email,
          newPassword: this.setpTwoValidateForm.value.newPassword,
          emailCaptcha: this.setpTwoValidateForm.value.emailCaptcha
        };
        this.doResetPassword();
      }
    } else { return; }
  }

  checkUser() {
    this.resetPassword.hasUser(this.setpOneValidateForm.value.email).subscribe(
      res => {
        this.isSubmitting = false;
        this.stepIndex += 1;
        this.email = this.setpOneValidateForm.value.email;
        this.setpOneValidateForm.reset();
      },
      error => {
        console.error(error);
        this.isSubmitting = false;
        if (error.status === 404) {
          this.setpOneValidateForm.controls.email.setErrors({ emailInvalid: true });
        } else {
          this.message.error(`Error: ${error.message}`, {
            nzDuration: 4000,
            nzPauseOnHover: true,
            nzAnimate: true
          });
        }
      }
    );
  }

  doResetPassword() {
    this.resetPassword.resetPassword(this.resetPosswordInfo).subscribe(
      res => {
        this.isSubmitting = false;
        this.stepIndex += 1;
        this.setpTwoValidateForm.reset();
        this.token.clear('all');
      },
      error => {
        console.log(error);
        this.isSubmitting = false;
        if (error.status === 403) {
          this.setpTwoValidateForm.controls.emailCaptcha.setErrors({ captchaError: true });
        } else {
          this.message.error(`Error: ${error.message}`, {
            nzDuration: 4000,
            nzPauseOnHover: true,
            nzAnimate: true
          });
        }
      }
    );
  }

  modifiyEmail(): void {
    this.stepIndex -= 1;
    this.setpTwoValidateForm.reset();
  }

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
    this.isGettingCaptcha = true;
    let secondCount = 60;
    this.resetPassword.sendMail(this.email).subscribe(
      res => {
        this.notify = 'Captcha email has been sent, valid within 5 minutes, please check.';
        const timer = setInterval(() => {
          this.getCaptchaBtnStr = `Get after ${--secondCount}s`;
          if (secondCount === 0) {
            this.isGettingCaptcha = false;
            this.getCaptchaBtnStr = 'Get captcha';
            clearInterval(timer);
          }
        }, 1000);
      },
      error => {
        console.error(error);
        this.isGettingCaptcha = false;
        this.message.error(`Error: ${error.message}`, {
          nzDuration: 4000,
          nzPauseOnHover: true,
          nzAnimate: true
        });
      }
    );
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.setpTwoValidateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.setpTwoValidateForm.controls.newPassword.value) {
      return { confirm: true };
    }
    return {};
  }

  ngOnInit() {
    this.setpOneValidateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]]
    });
    this.setpTwoValidateForm = this.fb.group({
      newPassword: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      email: [null],
      emailCaptcha: [null, [Validators.required]]
    });
  }
}
