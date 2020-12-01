import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Store } from '@ngrx/store';
import { from, Observable, forkJoin } from 'rxjs';
import {
  IExchangeFirebaseCollection,
  IProductFirebaseCollection,
  IUserFirebaseCollection,
} from '../firebase/interfaces/firestore.interface';
import { IInitialState } from '../store/interfaces/store.interface';
import { map, mergeAll, take } from 'rxjs/operators';
import { ILoginUser, IRegisterUser } from '../interfaces/user.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient,
    private firestore: AngularFirestore,
    private firebaseAuthentication: AngularFireAuth,
    private fireStorage: AngularFireStorage
  ) {}

  // LOGO METHODS SECTION
  public saveProfileLogo(file: Blob, id: number) {
    const fileRef = this.fireStorage.ref(`images/user/${id}/profile/logo`);

    return this.fireStorage.upload(`images/user/${id}/profile/logo`, file).snapshotChanges();
  }

  public getProfileLogo(id: number) {
    const fileRef = this.fireStorage.ref(`images/user/${id}/profile/logo`);

    return fileRef.getDownloadURL().pipe(
      map((url) => this.http.get(url, { responseType: 'blob' })),
      mergeAll()
    );
  }

  public saveProductImages(files: Blob[], userId: number, productId: number) {
    let fileObs = [];

    files.forEach((file, index) => {
      fileObs.push(
        this.fireStorage.upload(`images/user/${userId}/product/${productId}/photo_${index}`, file).snapshotChanges()
      );
    });

    return forkJoin(fileObs);
  }

  // CATEGORY METHODS SECTION
  public getAllCategories() {
    return this.categoryCollection$;
  }

  // PRODUCT METHODS SECTION
  public getAllUserProductsById(id: number) {
    return this.firestore
      .collection<IProductFirebaseCollection>('Products', (ref) => ref.where('userId', '==', id))
      .get()
      .pipe(map((snapshot) => (snapshot.empty ? null : ((snapshot.docs as unknown) as IProductFirebaseCollection[]))));
  }

  public getProductById(id: number) {
    return this.firestore
      .collection<IProductFirebaseCollection>('Products', (ref) => ref.where('id', '==', id))
      .get()
      .pipe(
        map((snapshot) =>
          snapshot.empty ? null : ((snapshot.docs[0].data() as unknown) as IProductFirebaseCollection)
        )
      );
  }

  public addProduct(product: IProductFirebaseCollection) {
    return this.productCollection$.pipe(
      take(1),
      map((data) => {
        const id = data?.length + 1;

        return from(this.firestore.collection<IProductFirebaseCollection>('Products').doc(id.toString()).set(product));
      }),
      mergeAll()
    );
  }

  public editProduct(product: IProductFirebaseCollection) {
    return this.firestore
      .collection<IProductFirebaseCollection>('Products')
      .doc(product.userId.toString())
      .update(product);
  }

  public deleteProductById(id: number) {
    return this.firestore.collection<IProductFirebaseCollection>('Products').doc(id.toString()).delete();
  }

  // USER METHODS SECTION
  public modifyUserData(userData: IUserFirebaseCollection, userId: number) {
    return this.firestore.collection<IUserFirebaseCollection>('Users').doc(userId.toString()).update(userData);
  }

  public getUserById(id: number) {
    return this.firestore
      .collection<IUserFirebaseCollection>('Users', (reference) => reference.where('id', '==', id))
      .get()
      .pipe(
        map((snapshot) => (snapshot.empty ? null : ((snapshot.docs[0].data() as unknown) as IUserFirebaseCollection)))
      );
  }

  public getUserByEmail(email: string): Observable<IUserFirebaseCollection> {
    return this.firestore
      .collection<IUserFirebaseCollection>('Users', (reference) => reference.where('email', '==', email))
      .get()
      .pipe(
        map((snapshot) => (snapshot.empty ? null : ((snapshot.docs[0].data() as unknown) as IUserFirebaseCollection)))
      );
  }

  public createUser({ email }: IRegisterUser) {
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
      }),
      mergeAll()
    );
  }

  public loginUserByCridentials({ email, password }: ILoginUser) {
    return from(this.firebaseAuthentication.signInWithEmailAndPassword(email, password));
  }

  public registerUserByCridentials({ email, password }: IRegisterUser) {
    return from(this.firebaseAuthentication.createUserWithEmailAndPassword(email, password));
  }

  public logOut() {
    return from(this.firebaseAuthentication.signOut());
  }

  public loginByGoogleProvider() {
    return this.loginByAuthProvider(new firebase.auth.GoogleAuthProvider());
  }

  private loginByAuthProvider(provider) {
    return from(this.firebaseAuthentication.signInWithPopup(provider));
  }
}
