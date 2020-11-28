import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from 'src/shared/components/login/login.component';
import { AuthGuardService, GuestGuardService } from 'src/shared/guards/authGuard.service';

const routes: Routes = [
  { path: '', redirectTo: 'guest', pathMatch: 'full' },
  {
    path: 'guest',
    canActivate: [GuestGuardService],
    component: LoginPageComponent,
  },
  {
    path: 'home',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../pages/homePage/homePage-module').then((m) => m.HomePageModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../pages/homePage/homePage-module').then((m) => m.HomePageModule),
  },
  {
    path: 'offer',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../pages/homePage/homePage-module').then((m) => m.HomePageModule),
  },
  {
    path: 'search',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../pages/homePage/homePage-module').then((m) => m.HomePageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
