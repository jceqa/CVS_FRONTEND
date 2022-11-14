import {Component, Inject, OnInit} from '@angular/core';
import {Usuario} from '../../../../../models/usuario';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {UsuarioService} from '../../../../../services/usuario.service';
import {UtilService} from '../../../../../services/util.service';
import {SucursalService} from '../../../../../services/sucursal.service';
import {Sucursal} from '../../../../../models/sucursal';
import {RolService} from '../../../../../services/rol.service';
import {RolPermiso} from '../../../../../models/rolPermiso';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss']
})
export class UsuarioDialogComponent implements OnInit {

    item: Usuario;
    companyId = 0;
    form: FormGroup;

    formType: FormType;
    sucursales: Sucursal[] = [];

    title: String;
    editID: number;

    roles: RolPermiso[] = [];
    rolesSelected: RolPermiso[] = [];

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<UsuarioDialogComponent>,
        private uiService: UIService,
        private usuarioService: UsuarioService,
        private sucursalService: SucursalService,
        private rolService: RolService,
        private utils: UtilService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            nombre: new FormControl('', [Validators.required]),
            usuario: new FormControl('', [Validators.required]),
            clave: new FormControl('', [Validators.required]),
            sucursal: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getUsuarioById(this.data.item.id);
            this.formType = FormType.EDIT;
            // this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.sucursalService.getSucursalByUserId(this.utils.getUserId()).subscribe(data => {
            console.log(data);
            this.sucursales = data;
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });

        this.utils.startLoading();
        this.rolService.getRoles().subscribe(data => {
            console.log(data);
            this.roles = data;
            this.utils.stopLoading();
        }, error => {
            console.log(error);
            this.utils.stopLoading();
        });
    }

    getUsuarioById(id: number): void {

        // Realiza la llamada http para obtener el objeto
        this.usuarioService.getUsuarioById(id).subscribe(
            data => {
                this.item = data as Usuario;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Usuario) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                nombre: item.nombre,
                usuario: item.usuario,
                sucursal: item.sucursal,
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.nombre = this.form.get('nombre').value.toString().toUpperCase().trim();
        this.item.usuario = this.form.get('usuario').value.toString().toUpperCase().trim();
        this.item.sucursal = this.form.get('sucursal').value;

        if (this.formType === FormType.NEW) {
            this.item.clave = this.form.get('clave').value.toString();
        }
    }

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    // Metodo que se llama al oprimir el boton guardar
    ok(): void {
        // Si es una edicion llama al metodo para editar
        if (this.formType === FormType.EDIT) {
            this.edit();
        }

        // Si es una lista nueva llama al metodo para agregar
        if (this.formType === FormType.NEW) {
            this.add();
        }
    }

    // Metodo para agregar una nueva lista de precios
    add(): void {

        this.setAtributes();
        this.item.id = 0;
        if (this.utils.tieneLetras(this.item.nombre)) {
            // Llama al servicio que almacena el objeto {PriceListDraft}
            this.usuarioService.guardarUsuario(this.item)
                .subscribe(data => {
                        console.log(data);
                        this.dialogRef.close(data);

                        this.uiService.showSnackbar(
                            'Agregado exitosamente.',
                            'Cerrar',
                            3000
                        );
                    },
                    (error) => {

                        console.error('[ERROR]: ', error);

                        this.uiService.showSnackbar(
                            error.error,
                            'Cerrar',
                            5000
                        );

                    }
                );
        } else {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
        }
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        // Asigna los valores del formulario al objeto a almacenar
        this.setAtributes();

        // Llama al servicio http que actualiza el objeto.
        if (this.utils.tieneLetras(this.item.nombre)) {
            this.usuarioService.editarUsuario(this.item).subscribe(data => {
                console.log(data);
                this.uiService.showSnackbar(
                    'Modificado exitosamente.',
                    'Cerrar',
                    3000
                );

                this.dialogRef.close(data);
            }, (error) => {
                console.error('[ERROR]: ', error);

                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            });
        } else {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
        }
    }

    selectedRoles($event): void {
        console.log($event.source._value);
        this.rolesSelected = $event.source._value;
    }

}
