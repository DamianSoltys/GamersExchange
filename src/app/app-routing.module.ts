import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/shared/components/main-components/login/login.component';
import { RegisterComponent } from 'src/shared/components/main-components/register/register.component';
import { AuthGuardService, GuestGuardService } from 'src/shared/guards/authGuard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [GuestGuardService],
    component: LoginComponent,
  },
  {
    path: 'register',
    canActivate: [GuestGuardService],
    component: RegisterComponent,
  },
  {
    path: 'home',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../pages/home-page/homePage-module').then((m) => m.HomePageModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../pages/profile-page/profilePage-module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'product',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../pages/product-page/productPage-module').then((m) => m.ProductPageModule),
  },
  {
    path: 'search',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../pages/search-page/searchPage-module').then((m) => m.SearchPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
