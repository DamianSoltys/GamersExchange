import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { AccountTypeEnum, IProductFirebaseCollection, IUserFirebaseCollection } from 'src/shared/firebase/interfaces/firestore.interface';
import { MainService } from 'src/shared/services/main.service';
import { DELETE_USER_PRODUCT, GET_ALL_PRODUCTS } from 'src/shared/store/actions/product.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';
import { MapComponent } from '../../common-components/map/map.component';

@Component({
  selector: 'app-product-search-list',
  templateUrl: './product-search-list.component.html',
  styleUrls: ['./product-search-list.component.scss'],
})
export class ProductSearchListComponent {
  @ViewChild('searchQuery', { static: true }) searchQuery: IonSearchbar;

  public productList$ = this.store.select('productState').pipe(map((productState) => productState.searchProducts));
  public loggedUser: IUserFirebaseCollection;
  public isAdmin = false;

  private loggedUser$ = this.store.select('userState').pipe(
    filter((userState) => userState?.loggedUser !== null),
    map((userState) => userState?.loggedUser)
  );
  private productList: IProductFirebaseCollection[];
  private destroy$ = new Subject();

  constructor(
    private store: Store<IInitialState>,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private mainService: MainService,
    private fb: FormBuilder
  ) {
    this.loggedUser$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.loggedUser = data;

      this.isAdmin = this.loggedUser.type === AccountTypeEnum.ADMIN;
    });

    this.productList$.pipe(takeUntil(this.destroy$)).subscribe((products) => {
      this.productList = products;
    });
  }

  public goToDetails(id: number) {
    this.router.navigate(['/product/details', id]);
  }

  public deleteProduct(userId:string,productId:number) {
    this.presentAlertConfirm(userId,productId);
  }

  // TODO make this into service
  private async presentAlertConfirm(userId:string,productId:number) {
    const alert = await this.alertController.create({
      header: 'Uwaga!',
      message: '<strong>Czy na pewno chcesz usunąć produkt?</strong>',
      buttons: [
        'Anuluj',
        {
          text: 'Potwierdź',
          handler: () => {
            this.mainService.dispatch(DELETE_USER_PRODUCT({ productId,userId }));
          },
        },
      ],
    });

    await alert.present();
  }

  public async openMapModal() {
    const modal = await this.modalController.create({
      component: MapComponent,
      componentProps: { data: this.productList },
    });

    return await modal.present();
  }

  ionViewDidEnter() {
    this.mainService.dispatch(GET_ALL_PRODUCTS({ payload: this.searchQuery.value }));

    this.searchQuery.ionChange
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        filter(({ detail: { value } }) => value?.length > 0)
      )
      .subscribe(({ detail: { value } }) => {
        this.mainService.dispatch(GET_ALL_PRODUCTS({ payload: value }));
      });
  }

  IonViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
