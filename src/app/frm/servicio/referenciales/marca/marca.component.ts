import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MarcaService } from '../../../../services/marca.service';
import { Marca } from '../../../../models/marca';
import { MatDialog } from '@angular/material/dialog';
import { MarcaDialogComponent } from './marca-dialog/marca-dialog.component';
//import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-marca',
    templateUrl: './marca.component.html',
    styleUrls: ['./marca.component.css']
})
export class MarcaComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<Marca>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    marcas: Marca[] = [];

    pagina = 1;
    numeroResultados = 5;


    constructor(
        private marcaService: MarcaService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.cargarMarcas();

        this.marcas = [];

        this.dataSource = new MatTableDataSource<Marca>(
            this.marcas
        );
        this.dataSource.paginator = this.paginator;

    }

    cargarMarcas() {
        this.marcaService.getBuscarMarcas(this.numeroResultados, this.pagina, "").subscribe(
            (data) => {
                console.log(data);
                this.marcas = data.registros;

                this.dataSource = new MatTableDataSource<Marca>(
                    this.marcas
                );
                this.dataSource.paginator = this.paginator;
            },
            err => {
                console.log(err.error);
            }
        );
    }

    addItem(): void {

        const item = new Marca();

        this.editItem(item);

    }

    editItem(item: Marca): void {
        const dialogRef = this.dialog.open(MarcaDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                //companyId: this.companyId,
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarMarcas();
            }
        });
    }

}