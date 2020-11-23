import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import {
  IExchangeFirebaseCollection,
  IProductFirebaseCollection,
  IUserFirebaseCollection,
} from '../firebase/interfaces/firestore.interface';
import { IInitialState } from '../store/interfaces/store.interface';
import { LOGIN_USER_ERROR, REGISTER_USER_ERROR } from '../store/actions/user.action';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  public isLoggedIn$ = this.firebaseAuthentication.authState;
  public userCollection$: Observable<IUserFirebaseCollection[]> = this.firestore
    .collection<IUserFirebaseCollection>('Users')
    .valueChanges();
  public categoryCollection$: Observable<string[]> = this.firestore.collection<string>('Categories').valueChanges();
  public productCollection$: Observable<
    IProductFirebaseCollection[]
  > = this.firestore.collection<IProductFirebaseCollection>('Products').valueChanges();
  public exchangeCollection$: Observable<
    IExchangeFirebaseCollection[]
  > = this.firestore.collection<IExchangeFirebaseCollection>('Exchanges').valueChanges();

  constructor(
    private store: Store<IInitialState>,
    private firestore: AngularFirestore,
    private firebaseAuthentication: AngularFireAuth
  ) {}

  public getUserByEmail(email: string) {
    return this.firestore
      .collection<IUserFirebaseCollection>('Users', (reference) => reference.where('email', '==', email))
      .get()
      .pipe(map((snapshot) => (snapshot.empty ? null : snapshot.docs[0])));
  }

  public registerUser(email: string) {
    return this.userCollection$.pipe(
      take(1),
      map((data) => {
        const id = data?.length + 1;
        const user: IUserFirebaseCollection = {
          address: null,
          email,
          firstName: null,
          id,
          interests: null,
          logo: null,
          platform: null,
          surname: null,
          userName: null,
        };

        return from(this.firestore.collection<IUserFirebaseCollection>('Users').doc(id.toString()).set(user));
      })
    );
  }

  public loginUserByCridentials(email: string, password: string) {
    this.firebaseAuthentication.signInWithEmailAndPassword(email, password);
  }

  public logOut() {
    this.firebaseAuthentication.signOut();
  }

  public loginByGoogleProvider(): Observable<firebase.auth.UserCredential> {
    return this.loginByAuthProvider(new firebase.auth.GoogleAuthProvider());
  }

  private loginByAuthProvider(provider) {
    return from(this.firebaseAuthentication.signInWithPopup(provider));
  }
}
