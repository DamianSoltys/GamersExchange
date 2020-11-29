import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/shared/components/login/login.component';
import { RegisterComponent } from 'src/shared/components/register/register.component';
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
    loadChildren: () => import('../pages/homePage/homePage-module').then((m) => m.HomePageModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuardService],
    loadChildren: () => import('../pages/profilePage/profilePage-module').then((m) => m.ProfilePageModule),
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
