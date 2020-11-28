import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { LOGOUT_USER } from 'src/shared/store/actions/user.action';
import { IInitialState, IUserState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private isLoggedIn$ = this.store.select('userState').pipe(map((state: IUserState) => state.isLoggedIn));

  constructor(private store: Store<IInitialState>) {}

  ngOnInit() {}

  public logOut() {
    this.store.dispatch(LOGOUT_USER());
  }

}
