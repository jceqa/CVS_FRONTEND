import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Cobro} from '../../../../models/cobro';
import {MatPaginator} from '@angular/material/paginator';
import {CobroService} from '../../../../services/cobro.service';
import {UIService} from '../../../../services/ui.service';
import {UtilService} from '../../../../services/util.service';

@Component({
  selector: 'app-cobro',
  templateUrl: './cobro.component.html',
  styleUrls: ['./cobro.component.sass']
})
export class CobroComponent implements OnInit {

  displayedColumns: string[] = ['id', 'descripcion', 'fecha', 'monto'];

  dataSource = new MatTableDataSource<Cobro>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  cobros: Cobro[] = [];

  pagina = 1;
  numeroResultados = 5;

  all = false;

  constructor(
      private cobroService: CobroService,
      private uiService: UIService,
      private util: UtilService
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    // this.store.dispatch(new UI.StartLoading());
    // this.util.localStorageSetItem('loading', 'true');
    this.util.startLoading();
    this.cobroService.getCobros(this.all).subscribe(
        (data) => {
          console.log(data);
          this.cobros = data;

          this.dataSource = new MatTableDataSource<Cobro>(
              this.cobros
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
