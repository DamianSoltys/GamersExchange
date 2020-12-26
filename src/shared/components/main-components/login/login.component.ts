import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { ILoginUser, IRegisterUser } from 'src/shared/interfaces/user.interface';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { MainService } from 'src/shared/services/main.service';
import { CHECK_AUTH, LOGIN_USER, LOGOUT_USER } from 'src/shared/store/actions/user.action';
import { IInitialState, IUserState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
  });

  constructor(private mainService: MainService, private fb: FormBuilder) {}

  ngOnInit() {}

  public loginUser(user: ILoginUser) {
    this.mainService.dispatch(LOGIN_USER({ payload: user }));
  }
}
