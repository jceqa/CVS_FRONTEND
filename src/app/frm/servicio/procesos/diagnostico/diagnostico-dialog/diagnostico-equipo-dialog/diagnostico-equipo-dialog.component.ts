import {Component, Inject, OnInit} from '@angular/core';
import {ServicioService} from '../../../../../../services/servicio.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormType} from '../../../../../../models/enum';
import {Servicio} from '../../../../../../models/servicio';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {UtilService} from '../../../../../../services/util.service';
import {DiagnosticoDetalle} from '../../../../../../models/diagnosticoDetalle';

@Component({
  selector: 'app-diagnostico-equipo-dialog',
  templateUrl: './diagnostico-equipo-dialog.component.html',
  styleUrls: ['./diagnostico-equipo-dialog.component.scss']
})
export class DiagnosticoEquipoDialogComponent implements OnInit {

    formType: FormType;
    item: DiagnosticoDetalle;

    servicios: Servicio[] = [];

    servicioSelected: Servicio[] = [];
    servicioControl = new FormControl('');
    servicioFiltered: Observable<Servicio[]>;

    // form: FormGroup;

  constructor(
      private dialogRef: MatDialogRef<DiagnosticoEquipoDialogComponent>,
      // private uiService: UIService,
      private servicioService: ServicioService,
      private utils: UtilService,
      // private dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data) {
          this.item = data.item;
      }
  }

    ngOnInit(): void {
      this.utils.startLoading();
      this.servicioService.listServicios().subscribe(data => {
          console.log(data);
          this.servicios = data;
          this.utils.stopLoading();
      }, error => {
          console.log(error);
          this.utils.stopLoading();
      });
    }

    selectedNotaCredito($event): void {
        console.log($event.source._value);
        this.servicioSelected = $event.source._value;
        /*this.totalNotasCredito = 0;
        this.total = 0;
        this.notasCreditoSelected.forEach(p => {
            this.totalNotasCredito += p.monto;
        });
        this.presupuestosSelected.forEach(pc => {
            this.total += pc.total;
        });
        if (this.total >= this.totalNotasCredito) {
            this.total -= this.totalNotasCredito;
        }

        const montoCuota = Math.round(this.total / this.utils.getNumber(this.form.get('cantidadCuota').value));
        this.form.get('montoCuota').setValue(montoCuota);*/
    }


    ok(): void {
        /*if (this.formType === FormType.EDIT) {
            this.edit();
        }*/

        // if (this.formType === FormType.NEW) {
            this.add();
        // }
    }

    add(): void {


        this.dialogRef.close(this.servicioSelected);
        /*this.setAtributes();
        this.item.id = 0;
        if (this.validarCampos()) {
            this.utils.startLoading();
            this.ordenCompraService.guardarOrdenCompra(this.item)
                .subscribe(data => {
                        console.log(data);
                        this.utils.stopLoading();
                        this.uiService.showSnackbar(
                            'Argregado exitosamente.',
                            'Cerrar',
                            3000
                        );

                    },
                    (error) => {
                        this.utils.stopLoading();
                        console.error('[ERROR]: ', error);

                        this.uiService.showSnackbar(
                            error.error,
                            'Cerrar',
                            5000
                        );

                    }
                );
        }*/
    }
}
