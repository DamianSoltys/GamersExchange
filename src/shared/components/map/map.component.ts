import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { latLng, Map, MapOptions, tileLayer } from 'leaflet';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GeolocationService } from 'src/shared/services/geolocation.service';
import { MainService } from 'src/shared/services/main.service';
import { IInitialState } from 'src/shared/store/interfaces/store.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
  @Input('data') data;
  @Input() options: MapOptions = {
    layers: [tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })],
    zoom: 14,
    center: latLng(46.879966, -121.726909),
  };

  public map: Map;
  public zoom: number;
  public loaded = false;

  private destroy$ = new Subject();

  constructor(
    private store: Store<IInitialState>,
    private mainService: MainService,
    private actions$: Actions,
    private geolocationService: GeolocationService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.geolocationService.currentPosition$.pipe(take(1)).subscribe(({ longitude, latitude }) => {
      this.options.center = latLng(latitude, longitude);
      this.loaded = true;
    });
  }

  public closeModal() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  ngOnDestroy() {
    this.map.clearAllEventListeners;
    this.map.remove();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onMapReady(map: Map) {
    this.map = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}
