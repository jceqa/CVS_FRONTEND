import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Pago} from '../../../../models/pago';
import {MatPaginator} from '@angular/material/paginator';
import {PagoService} from '../../../../services/pago.service';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';
import * as es6printJS from 'print-js';

@Component({
  selector: 'app-reporte-pago',
  templateUrl: './reporte-pago.component.html',
  styleUrls: ['./reporte-pago.component.sass']
})
export class ReportePagoComponent implements OnInit {

    displayedColumns: string[] = ['id', 'descripcion', 'fecha', 'monto'];

    dataSource = new MatTableDataSource<Pago>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    pagos: Pago[] = [];

    pagina = 1;
    numeroResultados = 5;

    all = false;
    fechaInicio = null;
    fechaFin = null;

    constructor(
        private pagoService: PagoService,
        private uiService: UIService,
        private util: UtilService
    ) { }

    ngOnInit(): void {
        this.cargar();
    }

    printTest() {
        const data = [];
        this.pagos.forEach( p => {
            const date = new Date(p.fecha);
            data.push({
                descripcion: p.descripcion,
                fecha: date.toLocaleDateString('en-US'),
                monto: p.monto
            });
        });
        es6printJS({
            printable: data,
            properties: [
                { field: 'descripcion', displayName: 'Descripción'},
                { field: 'fecha', displayName: 'Fecha'},
                { field: 'monto', displayName: 'Monto'}
            ],
            type: 'json',
            header: '' +
                '<img class="logo" src="assets/Innovalogic%20Logo.jpg" style="width: 20%" >' +
                '<h3 class="custom-h3">Reporte de Pagos</h3>',
            style: '.custom-h3 { color: black; }',
            gridHeaderStyle: 'color: black;  border: 2px solid #3971A5;',
            gridStyle: 'border: 2px solid #3971A5;'
        });
    }

    cargar() {
        this.util.startLoading();
        this.pagoService.getPagos().subscribe(
            (data) => {
                console.log(data);
                this.pagos = data;

                this.dataSource = new MatTableDataSource<Pago>(
                    this.pagos
                );
                this.dataSource.paginator = this.paginator;
                // this.store.dispatch(new UI.StopLoading());
                // this.util.localStorageSetItem('loading', 'false');
                this.util.stopLoading();
            },
            err => {
                // this.store.dispatch(new UI.StopLoading());
                // this.util.localStorageSetItem('loading', 'false');
                this.util.stopLoading();
                console.log(err.error);
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            }
        );
    }

}
