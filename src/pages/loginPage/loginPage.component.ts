import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { increment } from 'src/shared/store/actions/user.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './loginPage.component.html',
  styleUrls: ['./loginPage.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(
    private store: Store<IInitialState>,
    private firestore: AngularFirestore,
    private firebaseAuthentication: AngularFireAuth
  ) {}

  ngOnInit() {
    this.firebaseAuthentication.signInWithEmailAndPassword('dada', 'dada').then(() => {
      this.firestore
        .collection('Users')
        .valueChanges()
        .subscribe((data) => {
          console.log(data);
        });
    });

    this.store.select('count').subscribe((data) => {
      console.log(data);
    });

    this.store.select('count1').subscribe((data) => {
      console.log(data);
    });
  }

  increment() {
    this.store.dispatch(increment());
  }
}
