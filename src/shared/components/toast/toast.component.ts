import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { map, skip } from 'rxjs/operators';
import { ToastTypeEnum } from 'src/shared/interfaces/toast.interface';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit {

  constructor(public toastController: ToastController,private store: Store<IInitialState>) { }

  ngOnInit() {
    this.store.select('toastState').pipe(skip(1),map(toastState=>toastState?.toastData)).subscribe(toastData=>{
      this.presentToast(toastData.message,2000, toastData.type === ToastTypeEnum.ERROR? 'danger' : 'success');
    });
  }

  async presentToast(message,duration,color) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      cssClass:'custom-toast-container'
    });

    toast.present();
  }
}
