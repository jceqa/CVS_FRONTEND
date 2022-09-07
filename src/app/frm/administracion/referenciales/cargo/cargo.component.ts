import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CargoService } from '../../../../services/cargo.service';
import { Cargo } from '../../../../models/cargo';
import { MatDialog } from '@angular/material/dialog';
import { CargoDialogComponent } from './cargo-dialog/cargo-dialog.component';
import { UIService } from '../../../../services/ui.service';
import { ConfirmDialogComponent } from '../../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-cargo',
    templateUrl: './cargo.component.html',
    styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'actions'];

    dataSource = new MatTableDataSource<Cargo>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    cargos: Cargo[] = [];

    pagina = 1;
    numeroResultados = 5;

    constructor(
        private cargoService: CargoService,
        private dialog: MatDialog,
        private uiService: UIService,
    ) { }

    ngOnInit(): void {
        this.cargarCargos();
    }

    cargarCargos() {
        this.cargoService.getCargos().subscribe(
            (data) => {
                console.log(data);
                this.cargos = data;

                this.dataSource = new MatTableDataSource<Cargo>(
                    this.cargos
                );
                this.dataSource.paginator = this.paginator;
            },
            err => {
                console.log(err.error);
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    addItem(): void {

        const item = new Cargo();

        this.editItem(item);

    }

    editItem(item: Cargo): void {
        const dialogRef = this.dialog.open(CargoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarCargos();
            }
        });
    }

    deleteItem(id: number): void {
        this.cargoService.eliminarCargo(id).subscribe(
            result => {
                console.log(result);
                this.cargarCargos();

                this.uiService.showSnackbar(
                    'Eliminado correctamente.',
                    'Cerrar',
                    3000
                );
            }, error => {
                console.log(error);

                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        )
    }

    openDialog(event: any, cargo: Cargo): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            //width: '50vw',
            data: {
                title: "Eliminar Cargo",
                msg: "¿Está seguro que desea eliminar este cargo?"
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(cargo.id);
            }
        });
    }
}