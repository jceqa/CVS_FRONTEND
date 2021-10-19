import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MainContentComponent } from './main-content/main-content.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { LoginDialogComponent } from './login/login-dialog/login-dialog.component';
import { MaterialModule } from './material.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { MarcaComponent } from './frm/servicio/referenciales/marca/marca.component';
import { MarcaDialogComponent } from './frm/servicio/referenciales/marca/marca-dialog/marca-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    MainContentComponent,
    LoginPageComponent,
    LoginDialogComponent,
    ToolbarComponent,
    InfoDialogComponent,
    MarcaComponent,
    MarcaDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
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
    }//,
    //NotificadorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
