import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { MainContentComponent } from './main-content/main-content.component';
import { RegisterComponent } from './register/register.component';
import { CustomRouteReuseStrategy } from './services/CustomRouteReuseStrategy';
import { MarcaComponent } from './frm/servicio/referenciales/marca/marca.component'

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'marca', component: MarcaComponent },
  { path: '', component: MainContentComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
