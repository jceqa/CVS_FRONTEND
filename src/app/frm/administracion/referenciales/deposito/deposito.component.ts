import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Deposito} from '../../../../models/deposito';
import {MatDialog} from '@angular/material/dialog';
import {DepositoDialogComponent} from './deposito-dialog/deposito-dialog.component';
import {UIService} from '../../../../services/ui.service';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {DepositoService} from '../../../../services/deposito.service';
import {UtilService} from '../../../../services/util.service';

@Component({
    selector: 'app-deposito',
    templateUrl: './deposito.component.html',
    styleUrls: ['./deposito.component.css']
})
export class DepositoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'sucursal', 'actions'];

    dataSource = new MatTableDataSource<Deposito>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    depositos: Deposito[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;
    constructor(
        private depositoService: DepositoService,
        private dialog: MatDialog,
        private uiService: UIService,
        private util: UtilService
    ) {
    }

    ngOnInit(): void {
        this.cargarDepositos();
    }

    cargarDepositos() {
        this.util.startLoading();
        this.depositoService.getDepositos().subscribe(
            (data) => {
                console.log(data);
                this.depositos = data;

                this.dataSource = new MatTableDataSource<Deposito>(
                    this.depositos
                );
                this.dataSource.paginator = this.paginator;
                this.util.stopLoading();
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

        const item = new Deposito();

        this.editItem(item);

    }

    editItem(item: Deposito): void {
        const dialogRef = this.dialog.open(DepositoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarDepositos();
            }
        });
    }

    deleteItem(id: number): void {
        this.depositoService.eliminarDeposito(id).subscribe(
            result => {
                console.log(result);
                this.cargarDepositos();

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
        );
    }

    openDialog(event: any, deposito: Deposito): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar Deposito',
                msg: '¿Está seguro que desea eliminar este deposito?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(deposito.id);
            }
        });
    }
}
