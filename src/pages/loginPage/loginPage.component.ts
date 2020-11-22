import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './loginPage.component.html',
  styleUrls: ['./loginPage.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(private store: Store<IInitialState>) {}

  ngOnInit() {
    this.store.select('count').subscribe((data) => {
      console.log(data);
    });

    this.store.select('count1').subscribe((data) => {
      console.log(data);
    });
  }
}
