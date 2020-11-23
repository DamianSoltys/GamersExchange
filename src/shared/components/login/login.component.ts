import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { LOGIN_USER } from 'src/shared/store/actions/user.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(private store: Store<IInitialState>) {}

  ngOnInit() {}

  public loginUser() {
    this.store.dispatch(LOGIN_USER());
  }
}
