import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { NgxSpinnerService } from 'ngx-spinner';
import { Comentario } from '../models/comentario';
import { Critica } from '../models/critica';
import { Pelicula } from '../models/pelicula';
import { PeliculaService } from '../services/pelicula.service';
import { MatDialog } from '@angular/material/dialog';
import { AgregarComentarioComponent } from '../agregar-comentario/agregar-comentario.component';

@Component({
    selector: 'app-detalles',
    templateUrl: './detalles.component.html',
    styleUrls: ['./detalles.component.css']
})
export class DetallesComponent implements OnInit {

    id!: number;

    pelicula!: Pelicula;
    comentarios: Comentario[] = [];
    criticas: Critica[] = [];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private peliculaService: PeliculaService,
        //private SpinnerService: NgxSpinnerService,
        public dialog: MatDialog) {
        this.route.params.subscribe(
            (params: any) =>
                this.id = params.id
        );
    }

    ngOnInit(): void {
        this.consultarPeliculaCompleta(this.id);
    }

    consultarPeliculaCompleta(id: number) {
        //this.SpinnerService.show();
        this.peliculaService.getPelicula(id).subscribe(
            data => {
                this.pelicula = data;
                //this.SpinnerService.hide();
            },
            err => {
                console.log(err.error);
                //this.SpinnerService.hide();
            }
        );

        //this.SpinnerService.show();
        this.peliculaService.getCriticas(id).subscribe(
            data => {
                this.criticas = data;
                //this.SpinnerService.hide();
            },
            err => {
                console.log(err.error);
                //this.SpinnerService.hide();
            }
        );

        //this.SpinnerService.show();
        this.peliculaService.getComentarios(id).subscribe(
            data => {
                this.comentarios = data;
                //this.SpinnerService.hide();
            },
            err => {
                console.log(err.error);
                //this.SpinnerService.hide();
            }
        );
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AgregarComentarioComponent, {
            width: '40%',
            data: { id: this.id }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            console.log('Se cerro el modal');
        });
    }

    agregarComentario() {
        this.router.navigate([`/nuevo-comentario/${this.id}`], { relativeTo: this.route.parent });
    }

}
