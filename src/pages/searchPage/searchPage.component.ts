import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { LOGOUT_USER } from 'src/shared/store/actions/user.action';
import { IInitialState, IUserState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-search-page',
  templateUrl: './searchPage.component.html',
  styleUrls: ['./searchPage.component.css'],
})
export class SearchPageComponent implements OnInit {
  public userName$ = this.store.select('userState').pipe(map((user: IUserState) => user?.loggedUser?.userName));

  constructor(private store: Store<IInitialState>) {}

  ngOnInit() {}
}
