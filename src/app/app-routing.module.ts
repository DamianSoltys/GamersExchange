import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from 'src/pages/loginPage/loginPage.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../pages/loginPage/loginPage.module').then((m) => m.LoginPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
