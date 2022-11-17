import {Component, Inject, OnInit} from '@angular/core';
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
import {UsuarioDto} from '../../../../../models/usuarioDto';
import {Usuario} from '../../../../../models/usuario';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss']
})
export class UsuarioDialogComponent implements OnInit {

    item: UsuarioDto;
    companyId = 0;
    form: FormGroup;

    formType: FormType;
    sucursales: Sucursal[] = [];

    title: String;
    editID: number;

    roles: RolPermiso[] = [];
    rolesSelected: RolPermiso[] = [];

    selected = [];

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

        if (this.data.item.usuario) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.usuario.id;
            this.getUsuarioById(this.data.item.usuario.id);
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
            this.roles.forEach(r => {
                const exist = this.item.roles.find( rol => rol.id === r.rol.id);
                if (exist) {
                    this.selected.push(true);
                } else {
                    this.selected.push(false);
                }
            });
            console.log(this.selected);
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
                this.item = data as UsuarioDto;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: UsuarioDto) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.usuario.id,
                nombre: item.usuario.nombre,
                usuario: item.usuario.usuario,
                clave: item.usuario.clave,
                sucursal: item.usuario.sucursal,
            });
            this.item.roles.forEach(r => {
                this.rolesSelected.push(this.roles.find( rl => {
                    rl.rol.id = r.id;
                }));
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        if (!this.item.usuario) {
            this.item.usuario = new Usuario();
        }
        this.item.usuario.id = this.form.get('id').value;
        this.item.usuario.nombre = this.form.get('nombre').value.toString().toUpperCase().trim();
        this.item.usuario.usuario = this.form.get('usuario').value.toString().toUpperCase().trim();
        this.item.usuario.sucursal = this.form.get('sucursal').value;

        if (this.formType === FormType.NEW) {
            this.item.usuario.clave = this.form.get('clave').value.toString();
        }
        this.item.roles = [];
        this.rolesSelected.forEach(r => {
            this.item.roles.push(r.rol);
        });
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

    add(): void {
        this.setAtributes();
        this.item.usuario.id = 0;
        if (this.validarCampos()) {
            this.utils.startLoading();
            this.usuarioService.guardarUsuario(this.item)
                .subscribe(data => {
                        console.log(data);
                        this.utils.stopLoading();
                        this.dialogRef.close(data);
                        this.uiService.showSnackbar(
                            'Agregado exitosamente.',
                            'Cerrar',
                            3000
                        );
                    },
                    (error) => {
                        console.error('[ERROR]: ', error);
                        this.utils.stopLoading();
                        this.uiService.showSnackbar(
                            error.error,
                            'Cerrar',
                            5000
                        );

                    }
                );
        }
    }

    edit(): void {
        this.setAtributes();
        if (this.validarCampos()) {
            this.utils.startLoading();
            this.usuarioService.editarUsuario(this.item).subscribe(data => {
                console.log(data);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Modificado exitosamente.',
                    'Cerrar',
                    3000
                );
                this.dialogRef.close(data);
            }, (error) => {
                console.error('[ERROR]: ', error);
                this.utils.stopLoading();
                this.uiService.showSnackbar(
                    'Ha ocurrido un error.',
                    'Cerrar',
                    3000
                );
            });
        }
    }

    selectedRoles($event): void {
        // console.log($event.source._value);
        this.rolesSelected = $event.source._value;
        console.log(this.rolesSelected);
    }

    validarCampos(): boolean {
        if (!this.utils.tieneLetras(this.item.usuario.nombre)) {
            this.uiService.showSnackbar(
                'El nombre no puede ser solo númerico.',
                'Cerrar',
                5000
            );
            return false;
        } else if (!this.utils.tieneLetras(this.item.usuario.usuario)) {
            this.uiService.showSnackbar(
                'El usuario no puede ser solo númerico.',
                'Cerrar',
                5000
            );
            return false;
        } else if (this.rolesSelected.length <= 0) {
            this.uiService.showSnackbar(
                'Debe seleccionar al menos un rol.',
                'Cerrar',
                5000
            );
            return false;
        }
        return true;
    }

}
