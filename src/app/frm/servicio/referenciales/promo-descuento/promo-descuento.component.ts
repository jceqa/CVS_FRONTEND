import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {UIService} from '../../../../services/ui.service';
import {MatDialog} from '@angular/material/dialog';
import {PromoDescuentoDialogComponent} from './promo-descuento-dialog/promo-descuento-dialog.component';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {PromoDescuento} from '../../../../models/promoDescuento';
import {PromoDescuentoService} from '../../../../services/promodescuento.service';
import {UtilService} from '../../../../services/util.service';


@Component({
    selector: 'app-promo-descuento',
    templateUrl: './promo-descuento.component.html',
    styleUrls: ['./promo-descuento.component.css']
})
export class PromoDescuentoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'porcentaje', 'actions'];

    dataSource = new MatTableDataSource<PromoDescuento>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    promoDescuentos: PromoDescuento[] = [];

    pagina = 1;
    numeroResultados = 5;
    all = false;
    constructor(
        private promoDescuentoService: PromoDescuentoService,
        private dialog: MatDialog,
        private uiService: UIService,
        private utils: UtilService
    ) {
    }

    ngOnInit(): void {
        this.cargarPromoDescuentos();
    }

    cargarPromoDescuentos() {
        this.utils.startLoading();
        this.promoDescuentoService.listPromoDescuentos(this.all).subscribe(
            (data) => {
                console.log(data);
                this.promoDescuentos = data;
                this.dataSource = new MatTableDataSource<PromoDescuento>(
                    this.promoDescuentos
                );
                this.dataSource.paginator = this.paginator;
                this.utils.stopLoading();
            },
            err => {
                console.log(err.error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

    addItem(): void {
        const item = new PromoDescuento();
        this.editItem(item);
    }

    editItem(item: PromoDescuento): void {
        // console.log(item);
        const dialogRef = this.dialog.open(PromoDescuentoDialogComponent, {
            minWidth: '60%',
            // maxWidth: '600px',
            disableClose: true,
            data: {
                item: item
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.cargarPromoDescuentos();
            }
        });
    }

    deleteItem(id: number): void {
        this.utils.startLoading();
        this.promoDescuentoService.eliminarPromoDescuento(id).subscribe(
            result => {
                console.log(result);
                this.cargarPromoDescuentos();

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

    reactivateItem(promoDescuento: PromoDescuento): void {
        promoDescuento.estado = 'ACTIVO';
        this.promoDescuentoService.editarPromoDescuento(promoDescuento).subscribe(
            result => {
                console.log(result);
                this.cargarPromoDescuentos();
                this.uiService.showSnackbar(
                    'Reactivado correctamente.',
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

    delete(event: any, promoDescuento: PromoDescuento): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Eliminar esta Promocion/Descuento',
                msg: '¿Está seguro que desea eliminar esta promocion/descuento?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.deleteItem(promoDescuento.id);
            }
        });
    }

    reactivate(event: any, promoDescuento: PromoDescuento): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            // width: '50vw',
            data: {
                title: 'Reactivar Promocion/Descuento',
                msg: '¿Está seguro que desea reactivar esta promocion/Descuento?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result.data) {
                this.reactivateItem(promoDescuento);
            }
        });
    }
}
