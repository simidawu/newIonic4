import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  LoginForm: FormGroup;
  translateTexts: any;
  usernameErrorTip: string;
  passwordErrorTip: string;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.subscribeTranslateText();
    this.LoginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      rememberPWD: [''],
      autoLogin: ['']
    });
  }

  subscribeTranslateText() {
    this.translate
      .get([
        'Login.usernameErrorTip',
        'Login.passwordErrorTip',
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
    this.usernameErrorTip = this.translateTexts['Login.usernameErrorTip'];
    this.passwordErrorTip = this.translateTexts['Login.passwordErrorTip'];
  }

}
