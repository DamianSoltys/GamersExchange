import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { ToastTypeEnum } from 'src/shared/interfaces/toast.interface';
import { IRegisterUser } from 'src/shared/interfaces/user.interface';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { MainService } from 'src/shared/services/main.service';
import { GET_ALL_USER_PRODUCTS } from 'src/shared/store/actions/product.action';
import { SHOW_TOAST } from 'src/shared/store/actions/toast.action';
import { CHECK_AUTH, LOGIN_USER, LOGOUT_USER, REGISTER_USER } from 'src/shared/store/actions/user.action';
import { IInitialState, IUserState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  public productList$ = this.store.select('productState').pipe(
    filter((productState) => productState.products?.length > 0),
    map((productState) => productState.products)
  );
  public userId: number;

  private userId$ = this.store.select('userState').pipe(
    filter((userState) => userState?.loggedUser?.id !== null),
    map((userState) => userState?.loggedUser?.id)
  );

  constructor(private store: Store<IInitialState>, private router: Router) {
    this.userId$.subscribe((id) => {
      this.userId = id;
    });
  }

  public goToDetails(id: number) {
    this.router.navigate(['/product/details', id]);
  }

  ngOnInit() {
    this.store.dispatch(GET_ALL_USER_PRODUCTS({ payload: this.userId }));
  }
}
