import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RegisterService } from '../../services/register.service';
import { RegisterInfo } from '../../models/RegisterInfo';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { apiConfig } from '../../settings/apiConfig';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    private register: RegisterService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.agreementOriginUrl = apiConfig.host + 'htmls/agreement.html';
    this.agreementTrustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.agreementOriginUrl);
  }

  title = 'Register';
  validateForm: FormGroup;
  userInfo: RegisterInfo;
  agreementOriginUrl: string;
  agreementTrustedUrl: SafeResourceUrl;
  isSubmitting = false;
  isAgreementVisible = false;
  getCaptchaBtnStr = 'Get captcha';
  isGettingCaptcha = false;
  notify = '';

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls[i] !== this.validateForm.controls.email) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.userInfo = {
        nickname: this.validateForm.value.nickname,
        email: this.validateForm.value.email,
        password: this.validateForm.value.password,
        phoneNumber: this.validateForm.value.phoneNumber,
        emailCaptcha: this.validateForm.value.emailCaptcha
      };
      this.doRegister();
    }
  }

  doRegister() {
    this.register.register(this.userInfo).subscribe(
      res => this.router.navigate(['register/result']),
      error => {
        console.error(error.message, error);
        this.isSubmitting = false;
        if (error.status === 403) {
          this.validateForm.controls.emailCaptcha.setErrors({ captchaError: true });
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

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true };
    }
    return {};
  }

  asycEmailRegisteredValidator = (control: FormControl): Observable<any> => {
    return this.register.hasUser(control.value).pipe(
      map((res: any) => (res.status === 200 ? { hasUser: true } : null))
    );
  }

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
    this.isGettingCaptcha = true;
    let secondCount = 60;
    this.register.sendMail(this.validateForm.value.email).subscribe(
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

  showAgreementModal(e: MouseEvent): void {
    e.preventDefault();
    this.isAgreementVisible = true;
  }

  isAgree(): void {
    this.validateForm.controls.agree.setValue(true);
    this.isAgreementVisible = false;
  }

  isDisagree(): void {
    this.validateForm.controls.agree.setValue(false);
    this.isAgreementVisible = false;
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, {
        validators: [Validators.email, Validators.required],
        asyncValidators: [this.asycEmailRegisteredValidator],
        updateOn: 'blur'
      }],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+86'],
      phoneNumber: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(11)]],
      emailCaptcha: [null, [Validators.required]],
      agree: [false, [Validators.requiredTrue]]
    });
  }
}
