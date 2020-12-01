import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil, filter, take } from 'rxjs/operators';
import {
  InterestsEnum,
  IUserFirebaseCollection,
  PlatformEnum,
} from 'src/shared/firebase/interfaces/firestore.interface';
import {
  GET_USER,
  GET_USER_LOGO,
  GET_USER_LOGO_SUCCESS,
  GET_USER_SUCCESS,
  MODIFY_USER_DATA,
  SET_USER_LOGO,
  SET_USER_LOGO_SUCCESS,
} from 'src/shared/store/actions/user.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';
import { PhotoService } from 'src/shared/services/photo.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { Actions, ofType } from '@ngrx/effects';
import { MainService } from 'src/shared/services/main.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profilePage.component.html',
  styleUrls: ['./profilePage.component.css'],
})
export class ProfilePageComponent implements OnDestroy {
  public userData$ = this.store.select('userState').pipe(
    filter((data) => data.lastUserProfile !== null),
    map((userState) => userState?.lastUserProfile)
  );
  public loggedUser$ = this.store.select('userState').pipe(map((userState) => userState?.loggedUser));
  public toggleEdit = new BehaviorSubject(false);
  public capturedPhoto: Blob;
  public trustedCapturedPhoto: SafeUrl;
  public profileForm = this.fb.group({
    firstName: [null],
    surname: [null],
    userName: [null],
    platform: [null],
    interests: [null],
    address: this.fb.group({
      city: [null],
      country: [null],
      flatNo: [null],
      houseNo: [null],
      postalCode: [null],
      street: [null],
    }),
  });
  public platformOptions = Object.values(PlatformEnum);
  public interestsOptions = Object.values(InterestsEnum);

  private userData: IUserFirebaseCollection;
  private loggedUser: IUserFirebaseCollection;
  private destroy$ = new Subject();

  constructor(
    private store: Store<IInitialState>,
    private fb: FormBuilder,
    private actions$: Actions,
    private mainService: MainService,
    private photoService: PhotoService
  ) {
    this.actions$
      .pipe(takeUntil(this.destroy$), ofType(GET_USER_LOGO_SUCCESS, SET_USER_LOGO_SUCCESS))
      .subscribe(({ payload }) => {
        this.capturedPhoto = payload;
        this.trustedCapturedPhoto = photoService.formatToSafeURL(payload);
      });

    this.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.loggedUser = user;
    });

    this.userData$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.userData = user;
      this.profileForm.patchValue(user);
    });

    this.toggleEdit.pipe(takeUntil(this.destroy$)).subscribe((isEditable) => {
      isEditable ? setTimeout(() => this.profileForm.enable(), 0) : setTimeout(() => this.profileForm.disable(), 0);
    });
  }

  ionViewDidEnter() {
    if (!this.capturedPhoto) {
      this.mainService.dispatch(GET_USER_LOGO({ payload: this.loggedUser.id }));
    }

    this.mainService.dispatch(GET_USER({ payload: this.loggedUser.email }));
  }

  public submitModifyData(user: IUserFirebaseCollection) {
    this.mainService.dispatch(MODIFY_USER_DATA({ user, id: this.loggedUser.id }));
    this.toggleEdit.next(false);
  }

  public takePhoto() {
    this.mainService.dispatch(SET_USER_LOGO({ payload: this.loggedUser.id }));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
