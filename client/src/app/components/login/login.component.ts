import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { LoginInfo } from '../../models/LoginInfo';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private login: LoginService,
    private router: Router,
    private token: TokenService,
    private message: NzMessageService
  ) { }

  title = 'Login';
  passwordVisible = false;
  validateForm: FormGroup;
  loginInfo: LoginInfo;
  isLoggingIn = false;
  captchaArgs = {
    imgSrc: '',
    width: 93,
    height: 32
  };

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid && !this.isLoggingIn) {
      this.isLoggingIn = true;
      this.loginInfo = {
        email: this.validateForm.value.email,
        password: this.validateForm.value.password,
        captcha: this.validateForm.value.captcha
      };
      this.doLogin();
    }
  }

  doLogin() {
    this.login.login(this.loginInfo).subscribe(
      res => {
        if (this.validateForm.value.remember) {
          this.token.set('local', res.data.token);
        } else {
          this.token.set('session', res.data.token);
        }
        const redirect = this.token.redirectUrl ? this.token.redirectUrl : '/home';
        this.router.navigate([redirect]);
      },
      error => {
        console.error(error);
        this.isLoggingIn = false;
        if (error.status === 401 || error.status === 404) {
          this.validateForm.controls.email.setErrors({ loginFailed: true });
          this.validateForm.controls.password.setErrors({ loginFailed: true });
          this.updateCaptcha();
        } else if (error.status === 403) {
          this.validateForm.controls.captcha.setErrors({ captchaError: true });
          this.updateCaptcha();
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

  updateCaptcha(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    if (!this.isLoggingIn) {
      this.login.getCapthcha(this.captchaArgs.width, this.captchaArgs.height).subscribe(
        res => this.captchaArgs.imgSrc = res.data.captchaPic,
        error => console.error(error.message, error)
      );
    }
  }

  updateEmailValidator(): void {
    this.validateForm.controls.email.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      captcha: [null, [Validators.required]],
      remember: [true]
    });

    this.updateCaptcha();
  }
}
