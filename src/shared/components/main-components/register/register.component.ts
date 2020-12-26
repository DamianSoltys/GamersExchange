import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { ToastMessageEnum, ToastTypeEnum } from 'src/shared/interfaces/toast.interface';
import { IRegisterUser } from 'src/shared/interfaces/user.interface';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { MainService } from 'src/shared/services/main.service';
import { SHOW_TOAST } from 'src/shared/store/actions/toast.action';
import { CHECK_AUTH, LOGIN_USER, LOGOUT_USER, REGISTER_USER } from 'src/shared/store/actions/user.action';
import { IInitialState, IUserState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerForm = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
    confirmPassword: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
  });

  constructor(private store: Store<IInitialState>, private fb: FormBuilder, private mainService: MainService) {}

  ngOnInit() {}

  public registerUser(user: IRegisterUser) {
    if (user.password === user.confirmPassword) {
      this.mainService.dispatch(REGISTER_USER({ payload: user }));
    } else {
      this.mainService.dispatch(
        SHOW_TOAST({ payload: { type: ToastTypeEnum.ERROR, message: ToastMessageEnum.DIFFERENT_PASSWORD_ERROR } })
      );
    }
  }
}
