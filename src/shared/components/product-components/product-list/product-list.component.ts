import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { MainService } from 'src/shared/services/main.service';
import { DELETE_USER_PRODUCT, GET_ALL_USER_PRODUCTS } from 'src/shared/store/actions/product.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  public productList$ = this.store.select('productState').pipe(map((productState) => productState.products));
  public userId: string;

  private userId$ = this.store.select('userState').pipe(
    filter((userState) => userState?.loggedUser?.id !== null),
    map((userState) => userState?.loggedUser?.id)
  );
  private destroy$ = new Subject();

  constructor(
    private store: Store<IInitialState>,
    private router: Router,
    private alertController: AlertController,
    private mainService: MainService
  ) {
    this.userId$.pipe(takeUntil(this.destroy$)).subscribe((id) => {
      this.userId = id;
    });
  }

  public goToDetails(id: number) {
    this.router.navigate(['/product/details', id]);
  }

  public deleteProduct(id: number) {
    this.presentAlertConfirm(id);
  }

  // TODO make this into service
  private async presentAlertConfirm(id: number) {
    const alert = await this.alertController.create({
      header: 'Uwaga!',
      message: '<strong>Czy na pewno chcesz usunąć produkt?</strong>',
      buttons: [
        'Anuluj',
        {
          text: 'Potwierdź',
          handler: () => {
            this.mainService.dispatch(DELETE_USER_PRODUCT({ productId: id, userId: this.userId }));
          },
        },
      ],
    });

    await alert.present();
  }

  ionViewDidEnter() {
    this.mainService.dispatch(GET_ALL_USER_PRODUCTS({ payload: this.userId }));
  }

  IonViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
