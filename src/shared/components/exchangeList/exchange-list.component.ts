import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { IExchangeFirebaseCollection, StatusEnum } from 'src/shared/firebase/interfaces/firestore.interface';
import { MainService } from 'src/shared/services/main.service';
import {
  CHANGE_EXCHANGE_STATUS,
  DELETE_USER_PRODUCT,
  GET_ALL_USER_EXCHANGES,
  GET_ALL_USER_EXCHANGES_SUCCESS,
  GET_ALL_USER_PRODUCTS,
} from 'src/shared/store/actions/product.action';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-exchange-list',
  templateUrl: './exchange-list.component.html',
  styleUrls: ['./exchange-list.component.scss'],
})
export class ExchangeListComponent {
  public exchangesList$ = this.store.select('productState').pipe(map((productState) => productState.exchanges));
  public userId: number;

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

  public modifyProduct(exchange: IExchangeFirebaseCollection) {
    this.presentAlertChangeConfirm(exchange);
  }

  // TODO make this into service
  private async presentAlertConfirm(id: number) {
    const alert = await this.alertController.create({
      header: 'Uwaga!',
      message: '<strong>Czy na pewno chcesz usunąć ofertę?</strong>',
      buttons: [
        'Anuluj',
        {
          text: 'Potwierdź',
          handler: () => {
            // this.mainService.dispatch(DELETE_USER_PRODUCT({ productId: id, userId: this.userId }));
          },
        },
      ],
    });

    await alert.present();
  }

  private async presentAlertChangeConfirm(exchange: IExchangeFirebaseCollection) {
    const alert = await this.alertController.create({
      header: `Status: ${this.getStatus(exchange)}`,
      message: '<strong>Potwierdź aby zmienić status</strong>',
      inputs: [
        {
          name: this.getStatusToChange(exchange),
          type: 'radio',
          label: this.getStatusToChange(exchange),
          value: this.getStatusToChange(exchange),
          checked: true,
        },
        {
          name: 'CANCELED',
          type: 'radio',
          label: 'CANCELED',
          value: 'CANCELED',
        },
      ],
      buttons: [
        'Anuluj',
        {
          text: 'Potwierdź',
          handler: (status) => {
            const modifiedExchange = { ...exchange };

            if (status !== StatusEnum.CANCELED) {
              if (this.isOwner(exchange.ownerId)) {
                modifiedExchange.ownerOfferData.status = status;
              } else {
                modifiedExchange.buyerOfferData.status = status;
              }
            } else {
              modifiedExchange.ownerOfferData.status = status;
              modifiedExchange.buyerOfferData.status = status;
            }

            if (modifiedExchange.ownerOfferData.status === modifiedExchange.buyerOfferData.status) {
              modifiedExchange.status = status;
            }

            this.mainService.dispatch(CHANGE_EXCHANGE_STATUS({ payload: modifiedExchange }));
          },
        },
      ],
    });

    await alert.present();
  }

  private isOwner(ownerId: number) {
    return ownerId === this.userId;
  }

  private getStatus(exchange: IExchangeFirebaseCollection) {
    return this.isOwner(exchange.ownerId) ? exchange.ownerOfferData.status : exchange.buyerOfferData.status;
  }

  private getStatusToChange(exchange: IExchangeFirebaseCollection) {
    const ownerStatus = exchange.ownerOfferData.status;
    const buyerStatus = exchange.buyerOfferData.status;

    if (
      (ownerStatus === StatusEnum.PENDING || buyerStatus === StatusEnum.PENDING) &&
      this.getStatus(exchange) === StatusEnum.PENDING
    ) {
      return StatusEnum.ACCEPTED;
    }

    if (
      (ownerStatus === StatusEnum.ACCEPTED || buyerStatus === StatusEnum.ACCEPTED) &&
      this.getStatus(exchange) === StatusEnum.ACCEPTED
    ) {
      return StatusEnum.SUCCESS;
    }
  }

  ionViewDidEnter() {
    this.mainService.dispatch(GET_ALL_USER_EXCHANGES({ payload: this.userId }));
  }

  IonViewDidLeave() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
