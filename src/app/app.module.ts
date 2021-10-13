import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PeliculaComponent } from './pelicula/pelicula.component';
import { CommonModule } from '@angular/common';
import { DetallesComponent } from './detalles/detalles.component';
//import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login_old/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgregarComentarioComponent } from './agregar-comentario/agregar-comentario.component';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MyMatPaginatorIntl } from './MyMatPaginatorIntl';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificadorService } from 'src/notificador.service';
import { MainContentComponent } from './main-content/main-content.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { LoginDialogComponent } from './login/login-dialog/login-dialog.component';
import { MaterialModule } from './material.module';
import { ToolbarComponent } from './toolbar/toolbar.component';


@NgModule({
  declarations: [
    AppComponent,
    PeliculaComponent,
    DetallesComponent,
    LoginComponent,
    AgregarComentarioComponent,
    MainContentComponent,
    LoginComponent,
    LoginPageComponent,
    LoginDialogComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    //NgxSpinnerModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    //NgbModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule,
    RouterModule.forRoot([]),
    StoreModule.forRoot({}, {}),
    MaterialModule
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MyMatPaginatorIntl
    },
    NotificadorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
