import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { AgregarComentarioComponent } from './agregar-comentario/agregar-comentario.component';
import { DetallesComponent } from './detalles/detalles.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
//import { LoginComponent } from './login_old/login.component';
import { MainContentComponent } from './main-content/main-content.component';
import { PeliculaComponent } from './pelicula/pelicula.component';
import { RegisterComponent } from './register/register.component';
import { CustomRouteReuseStrategy } from './services/CustomRouteReuseStrategy';

const routes: Routes = [
  { path: 'pelicula', component: PeliculaComponent },
  { path: 'detalles/:id', component: DetallesComponent },
  { path: 'nuevo-comentario/:id', component: AgregarComentarioComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: MainContentComponent  },
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
