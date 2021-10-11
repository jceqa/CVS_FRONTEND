import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Comentario } from '../models/comentario';
import { ComentarioService } from '../services/comentario.service';
import { DetallesComponent } from '../detalles/detalles.component';

@Component({
  selector: 'app-agregar-comentario',
  templateUrl: './agregar-comentario.component.html',
  styleUrls: ['./agregar-comentario.component.sass']
})
export class AgregarComentarioComponent implements OnInit {

  comentario : Comentario = new Comentario();
  
  headers! : {};

  token! : string;

  texto! : string;

  cals = [1, 2, 3, 4, 5];

  selectedCal! : number;

  constructor(private comentarioService : ComentarioService,
              public dialogRef: MatDialogRef<DetallesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    console.log("Desde el modal" + this.data.id)
    this.dialogRef.close();
  }

  guardar(){
    this.comentario.calificacion = this.selectedCal;
    this.comentario.pelicula = this.data.id;
    console.log(this.comentario);
    console.log(localStorage.getItem('ACCESS_TOKEN'));
    this.token = JSON.stringify(localStorage.getItem('ACCESS_TOKEN') || "");
    this.token = this.token.replace(/['"]+/g, '');
    //this.token = "fvWQCYvc44ejQySeJwxt7ntloExrcxd3BD6jTmSaH1dSGmdlbnwhuVw2LmhdvKSO";
    console.log(this.token);
    this.comentarioService.guardar(this.comentario, this.token).subscribe(data => {
      console.log(data);
      //this.router.navigateByUrl('/')
    }, 
    error => {
      console.error('There was an error!', error);
    });
  }

}
