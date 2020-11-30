import { Component, SecurityContext } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil, filter, take } from 'rxjs/operators';
import {
  InterestsEnum,
  IUserFirebaseCollection,
  PlatformEnum,
} from 'src/shared/firebase/interfaces/firestore.interface';
import { GET_USER, MODIFY_USER_DATA } from 'src/shared/store/actions/user.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';
import { PhotoSevice } from 'src/shared/services/photo.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FirebaseService } from 'src/shared/services/firebase.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profilePage.component.html',
  styleUrls: ['./profilePage.component.css'],
})
export class ProfilePageComponent {
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
    private fireService: FirebaseService,
    private photoService: PhotoSevice,
    private sanitizer: DomSanitizer
  ) {
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
    this.store.dispatch(GET_USER({ payload: this.loggedUser.email }));
    //TODO CHANGE TO ACTION
    this.setProfileLogo(this.fireService.getProfileLogo(this.loggedUser.id));
  }

  public submitModifyData(user: IUserFirebaseCollection) {
    this.store.dispatch(MODIFY_USER_DATA({ user, id: this.loggedUser?.id }));
  }

  public takePhoto() {
    this.setProfileLogo(this.photoService.takePhoto(), true);
  }

  private formatToSafeURL(file: Blob) {
    const url = URL.createObjectURL(file);
    const trustedUrl = this.sanitizer.bypassSecurityTrustUrl(url);

    return this.sanitizer.sanitize(SecurityContext.URL, trustedUrl);
  }

  private setProfileLogo(observable: Observable<Blob>, saveLogo?: boolean) {
    observable.pipe(take(1)).subscribe((photo) => {
      console.log(photo);
      this.capturedPhoto = photo;
      this.trustedCapturedPhoto = this.formatToSafeURL(photo);
      //TODO CHANGE TO ACTION
      if (saveLogo) {
        this.fireService.saveProfileLogo(photo, this.loggedUser.id);
      }
    });
  }

  ionViewWillLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
