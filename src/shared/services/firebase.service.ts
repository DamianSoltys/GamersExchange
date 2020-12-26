import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Store } from '@ngrx/store';
import { from, Observable, forkJoin, of, combineLatest } from 'rxjs';
import {
  AccountTypeEnum,
  IExchangeFirebaseCollection,
  IProductFirebaseCollection,
  IUserFirebaseCollection,
} from '../firebase/interfaces/firestore.interface';
import { IInitialState } from '../store/interfaces/store.interface';
import { catchError, combineAll, map, mergeAll, switchMap, take } from 'rxjs/operators';
import { ILoginUser, IRegisterUser } from '../interfaces/user.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { SHOW_TOAST } from '../store/actions/toast.action';
import { ToastMessageEnum, ToastTypeEnum } from '../interfaces/toast.interface';

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
  ) { }

  // LOGO METHODS SECTION
  public saveProfileLogo(file: Blob, id: string) {
    const fileRef = this.fireStorage.ref(`images/user/${id}/profile/logo`);

    return this.fireStorage.upload(`images/user/${id}/profile/logo`, file).snapshotChanges();
  }

  public getProfileLogo(id: string) {
    const fileRef = this.fireStorage.ref(`images/user/${id}/profile/logo`);

    return fileRef.getDownloadURL().pipe(
      map((url) => this.http.get(url, { responseType: 'blob' })),
      mergeAll()
    );
  }

  public async getProductImages(productId: number, userId: string) {
    const fileRef = this.fireStorage.ref(`images/user/${userId}/product/${productId}`);

    return fileRef.listAll().pipe(
      switchMap((data) => {
        const blobObservables: Observable<Blob>[] = [];

        data.items.forEach((item) => {
          blobObservables.push(
            from(item.getDownloadURL()).pipe(
              map((url) => this.http.get(url, { responseType: 'blob' })),
              mergeAll()
            )
          );
        });

        return forkJoin(!!blobObservables.length ? blobObservables : [(of(null) as unknown) as Blob[]]);
      })
    );
  }

  public saveProductImages(files: Blob[], userId: string, productId: number) {
    const fileObs: Observable<any>[] = [];

    files.forEach((file, index) => {
      fileObs.push(
        this.fireStorage
          .upload(`images/user/${userId}/product/${productId}/photo_${index}`, file)
          .snapshotChanges()
          .pipe(
            catchError((err, caught) => {
              this.store.dispatch(
                SHOW_TOAST({ payload: { type: ToastTypeEnum.ERROR, message: ToastMessageEnum.FILE_ADD_ERROR } })
              );

              return caught;
            })
          )
      );
    });

    return forkJoin(fileObs);
  }

  public removeProductImages(productId: number, userId: string) {
    const fileRef = this.fireStorage.ref(`images/user/${userId}/product/${productId}`);

    return fileRef.listAll().pipe(
      switchMap((list) => {
        const deleteObs = [];

        list.items.forEach((item) => {
          deleteObs.push(
            item.delete().catch(() => {
              this.store.dispatch(
                SHOW_TOAST({
                  payload: { type: ToastTypeEnum.ERROR, message: ToastMessageEnum.PRODUCT_FOLDER_REMOVE_ERROR },
                })
              );
            })
          );
        });

        return !!deleteObs.length ? forkJoin(deleteObs) : of([]);
      })
    );
  }

  // CATEGORY METHODS SECTION
  public getAllCategories() {
    return this.categoryCollection$.pipe(map((categories) => Object.values(categories[0])));
  }

  // EXCHANGE METHODS SECTION
  public getAllUserExchangesById(id: string) {
    const ownerQuery = this.firestore
      .collection<IExchangeFirebaseCollection>('Exchanges', (ref) => ref.where('ownerId', '==', id))
      .get();
    const buyerQuery = this.firestore
      .collection<IExchangeFirebaseCollection>('Exchanges', (ref) => ref.where('buyerId', '==', id))
      .get();

    return combineLatest([ownerQuery, buyerQuery]).pipe(
      map(([buyerQuery, ownerQuery]) => {
        const rawData = [].concat(buyerQuery, ownerQuery);
        const filteredData = [];

        rawData.forEach((data) => {
          if (!!data.docs?.length) {
            data.docs.forEach((doc) => {
              filteredData.push(doc.data());
            });
          }
        });

        return filteredData.filter((value, index, array) => array.findIndex((data) => data.id === value.id) === index);
      })
    );
  }

  public addExchange(exchange: IExchangeFirebaseCollection, owner?: IUserFirebaseCollection) {
    const id = Number(`${new Date().getTime()}${Math.floor(1000 + Math.random() * 9000)}`);
    const exchangeData: IExchangeFirebaseCollection = JSON.parse(JSON.stringify(exchange));

    exchangeData.ownerOfferData.userName = owner?.userName || null;
    exchangeData.ownerOfferData.phone = owner?.phone || null;
    exchangeData.ownerOfferData.email = owner?.email || null;
    exchangeData.id = id;

    return from(
      this.firestore
        .collection<IExchangeFirebaseCollection>('Exchanges')
        .doc(exchangeData.id.toString())
        .set(exchangeData)
    );
  }

  public getExchangeById(id: number) {
    return this.firestore
      .collection<IExchangeFirebaseCollection>('Exchanges', (reference) => reference.where('id', '==', Number(id)))
      .get()
      .pipe(
        map((snapshot) =>
          snapshot.empty ? null : ((snapshot.docs[0].data() as unknown) as IExchangeFirebaseCollection)
        )
      );
  }

  public modifyExchangeData(exchangeData: IExchangeFirebaseCollection) {
    return this.firestore
      .collection<IExchangeFirebaseCollection>('Exchanges')
      .doc(exchangeData.id.toString())
      .update(exchangeData);
  }

  public deleteExchangeById(exchangeId: number) {
    return from(this.firestore.collection<IExchangeFirebaseCollection>('Exchanges').doc(exchangeId.toString()).delete());
  }

  // PRODUCT METHODS SECTION
  public getSearchedProducts(query: string): Observable<IProductFirebaseCollection[]> {
    const categoryQuery = this.firestore
      .collection<IProductFirebaseCollection>('Products', (ref) => ref.where('category', 'array-contains', query))
      .get();
    const platformQuery = this.firestore
      .collection<IProductFirebaseCollection>('Products', (ref) => ref.where('platform', 'array-contains', query))
      .get();
    const nameQuery = this.firestore
      .collection<IProductFirebaseCollection>('Products', (ref) => ref.where('name', '==', query))
      .get();
    const stateQuery = this.firestore
      .collection<IProductFirebaseCollection>('Products', (ref) => ref.where('state', '==', query))
      .get();

    return !!query?.length
      ? combineLatest([categoryQuery, stateQuery, platformQuery, nameQuery]).pipe(
        map(([categoryQuery, stateQuery, platformQuery, nameQuery]) => {
          const rawData = [].concat(categoryQuery, stateQuery, platformQuery, nameQuery);
          const filteredData = [];

          rawData.forEach((data) => {
            if (!!data.docs?.length) {
              data.docs.forEach((doc) => {
                filteredData.push(doc.data());
              });
            }
          });

          return filteredData.filter(
            (value, index, array) => array.findIndex((data) => data.id === value.id) === index
          );
        })
      )
      : this.productCollection$;
  }

  public getAllUserProductsById(id: string) {
    return this.firestore
      .collection<IProductFirebaseCollection>('Products', (ref) => ref.where('userId', '==', id))
      .get()
      .pipe(
        map((snapshot) => {
          if (snapshot.empty) {
            return [];
          } else {
            const mappedData: IProductFirebaseCollection[] = [];

            snapshot.docs.forEach((product) => mappedData.push(product.data()));

            return mappedData;
          }
        })
      );
  }

  public getProductById(id: number) {
    return this.firestore
      .collection<IProductFirebaseCollection>('Products', (ref) => ref.where('id', '==', Number(id)))
      .get()
      .pipe(
        map((snapshot) => {
          return snapshot.empty ? null : ((snapshot.docs[0].data() as unknown) as IProductFirebaseCollection);
        })
      );
  }

  public addProduct(product: IProductFirebaseCollection, files: Blob[]) {
    const id = Number(`${new Date().getTime()}${Math.floor(1000 + Math.random() * 9000)}`);
    const productData = { ...product };

    productData.id = id;
    return from(
      this.firestore.collection<IProductFirebaseCollection>('Products').doc(productData.id.toString()).set(productData)
    ).pipe(
      map(() => {
        if (files?.length > 0) {
          this.saveProductImages(files, productData.userId, productData.id);
        }
      })
    );
  }

  // public editProduct(product: IProductFirebaseCollection) {
  //   return this.firestore
  //     .collection<IProductFirebaseCollection>('Products')
  //     .doc(product.userId.toString())
  //     .update(product);
  // }

  public deleteProductById(productId: number) {
    return from(this.firestore.collection<IProductFirebaseCollection>('Products').doc(productId.toString()).delete());
  }

  // USER METHODS SECTION
  public modifyUserData(userData: IUserFirebaseCollection, userId: string) {
    return this.firestore.collection<IUserFirebaseCollection>('Users').doc(userId).update(userData);
  }

  public getUserById(id: string) {
    return this.firestore
      .collection<IUserFirebaseCollection>('Users', (reference) => reference.where('id', '==', Number(id)))
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

  public getAllUsers() {
    return this.firestore
      .collection<IUserFirebaseCollection>('Users')
      .get()
      .pipe(
        map((snapshot) => {
          if (snapshot.empty) {
            return [];
          } else {
            const mappedData: IUserFirebaseCollection[] = [];

            snapshot.docs.forEach((user) => mappedData.push(user.data()));

            return mappedData;
          }
        })
      );
  }

  public createUser(email:string,uid:string) {
    const userData: IUserFirebaseCollection = {
      address: null,
      email,
      firstName: null,
      id:uid,
      phone: null,
      interests: null,
      logo: null,
      platform: null,
      surname: null,
      userName: null,
      type: AccountTypeEnum.USER,
    };

    return from(this.firestore.collection<IUserFirebaseCollection>('Users').doc(uid).set(userData));
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
