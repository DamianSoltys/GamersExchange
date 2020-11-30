import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';
import { IUserFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';
import { GET_USER, LOGOUT_USER, MODIFY_USER_DATA } from 'src/shared/store/actions/user.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';
import { PhotoSevice } from 'src/shared/services/photo.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profilePage.component.html',
  styleUrls: ['./profilePage.component.css'],
})
export class ProfilePageComponent {
  public userData$ = this.store.select('userState').pipe(
    filter(data => data.lastUserProfile !== null), map(userState => userState?.lastUserProfile)
  );
  public loggedUser$ = this.store.select('userState').pipe(
    map(userState => userState?.loggedUser)
  );
  public toggleEdit = new BehaviorSubject(false);
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
      street: [null]
    })
  });

  private userData: IUserFirebaseCollection;
  private loggedUser: IUserFirebaseCollection;
  private destroy$ = new Subject();

  constructor(private store: Store<IInitialState>, private fb: FormBuilder, private photoService: PhotoSevice) {
    this.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.loggedUser = user;
    });

    this.userData$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.userData = user;
      this.profileForm.patchValue(user);
    });

    this.toggleEdit.pipe(takeUntil(this.destroy$)).subscribe(isEditable => {
      isEditable ? this.profileForm.enable() : this.profileForm.disable()
    });
  }

  ionViewWillEnter() {
    this.store.dispatch(GET_USER({ payload: this.loggedUser.email }));
  }

  public submitModifyData(user: IUserFirebaseCollection) {
    this.store.dispatch(MODIFY_USER_DATA({ user, id: this.loggedUser?.id }));
  }

  public takePhoto() {
    this.photoService.takePhoto().subscribe(photo => {
      console.log(photo);
    });
  }

  ionViewWillLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
