import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {RolService} from '../../../../../services/rol.service';
import {UtilService} from '../../../../../services/util.service';
import {MenuService} from '../../../../../services/menu.service';
import {FormularioService} from '../../../../../services/formulario.service';
import {Formulario} from '../../../../../models/formulario';
import {Sistema} from '../../../../../models/sistema';
import {SubMenu} from '../../../../../models/subMenu';
import {RolPermiso} from '../../../../../models/rolPermiso';
import {PermisoService} from '../../../../../services/permiso.service';
import {Rol} from '../../../../../models/rol';

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.scss']
})
export class RolDialogComponent implements OnInit {

    item: RolPermiso;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    menu;
    formularios: Formulario[];
    sistemas: Sistema[];
    subMenus: SubMenu[];

    rolPermiso: RolPermiso;

    menuLoaded = false;
    formularioLoaded = false;
    colors = ['primary', 'accent', 'warn', 'success'];

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<RolDialogComponent>,
        private uiService: UIService,
        private rolService: RolService,
        private utils: UtilService,
        private menuService: MenuService,
        private formularioService: FormularioService,
        private permisoService: PermisoService,
        @Inject(MAT_DIALOG_DATA) public data: {item: RolPermiso}) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            nombre: new FormControl('', [Validators.required]),
        });

        if (this.data.item.rol.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.rol.id;
            this.getRolById(this.data.item.rol.id);
            this.formType = FormType.EDIT;
            // this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.menuService.getMenu().subscribe( data => {
                // console.log(data);
                this.sistemas = data.sistemas;
                this.subMenus = data.subMenus;
                this.menuLoaded = true;
                this.generarMenu();
                this.utils.stopLoading();
            },
            error => {
                this.utils.stopLoading();
                console.log(error);
            });

        this.utils.startLoading();
        this.formularioService.getFormularios().subscribe( data => {
                // console.log(data);
                this.formularios = data;
                this.formularioLoaded = true;
                this.generarMenu();
                this.utils.stopLoading();
            },
            error => {
                this.utils.stopLoading();
                console.log(error);
            });
    }

    getRolById(id: number): void {
        // Realiza la llamada http para obtener el objeto
        this.utils.startLoading();
        this.rolService.getRolById(id).subscribe(
            data => {
                this.item = data as RolPermiso;
                this.permisoService.getPermisosByRolId(this.item.rol.id).subscribe(result => {
                    // console.log(result);
                    const formularios = [];
                    result.forEach( r => {
                        formularios.push(r.formulario);
                    });
                    this.setForm(this.item.rol, formularios);
                    this.utils.stopLoading();
                }, (error) => {
                    this.utils.stopLoading();
                    console.log(error);
                });
            }, (error) => {
                this.utils.stopLoading();
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Rol, formulario) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                nombre: item.nombre
            });

            this.menu.forEach( m => {
                m.Items.forEach( i => {
                    i.SubItems.forEach( si => {
                        const exist = formulario.find(f => f.id === si.id);
                        if (exist) {
                            si.checked = true;
                        }
                    });
                });
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.rol.id = this.form.get('id').value;
        this.item.rol.nombre = this.form.get('nombre').value.toString().toUpperCase().trim();

        // console.log(this.menu);
        const formularios: Formulario[] = [];

        this.menu.forEach( m => {
            // if (m.checked) {
               m.Items.forEach( i => {
                 // if (i.checked) {
                     i.SubItems.forEach( si => {
                        if (si.checked) {
                            formularios.push({
                                id: si.id,
                                nombre: si.Name,
                                url: si.Url,
                                estado: si.estado,
                                sistema: si.sistema,
                                subMenu: si.subMenu
                            });
                        }
                     });
                 // }
               });
            // }
        });

        this.rolPermiso = {
            rol: this.item.rol,
            formularios: formularios
        };
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
        this.item.rol.id = 0;
        if (this.utils.tieneLetras(this.item.rol.nombre)) {
            // Llama al servicio que almacena el objeto {PriceListDraft}
            this.rolService.guardarRol(this.rolPermiso)
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
        if (this.utils.tieneLetras(this.item.rol.nombre)) {
            this.rolService.editarRol(this.rolPermiso).subscribe(data => {
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

    generarMenu() {
        if (this.menuLoaded && this.formularioLoaded) {
            const newMenu = [];
            let j = 0;
            this.sistemas.forEach(s => {
                    newMenu.push({
                        Icon : null,
                        Name : s.nombre,
                        Items: [],
                        checked: false,
                        color: this.colors[j]
                    });
                    j++;
                }
            );

            newMenu.forEach(nm =>
                this.subMenus.forEach(sm => {
                        nm.Items.push({
                            Name : sm.nombre,
                            SubItems : [],
                            checked: false,
                        });
                    }

                )
            );

            this.formularios.forEach(f =>
                newMenu.find( nm => nm.Name === f.sistema.nombre).Items.
                find(i => i.Name === f.subMenu.nombre).SubItems.
                push({
                    id : f.id,
                    Url : f.url,
                    Name : f.nombre,
                    checked: false,
                    estado: f.estado,
                    sistema: f.sistema,
                    subMenu: f.subMenu,
                })
            );

            console.log(newMenu);
            this.menu = newMenu;
        }
    }

    selectAll(checked: boolean, sistema) {
        sistema.checked = checked;
        sistema.Items.forEach(i => {
            i.checked = checked;
            i.SubItems.forEach(si => si.checked = checked);
        });
    }

    selectAllSubMenu(checked: boolean, Item, sistema) {
        Item.checked = checked;
        Item.SubItems.forEach(si => si.checked = checked);

        let numChecked = 0;
        let items = 0;
        sistema.Items.forEach(
            i => {
                i.SubItems.forEach(
                    si => {
                        if (si.checked) {
                            numChecked++;
                        }
                        items++;
                    }
                );
            }
        );

        if (numChecked === 0) {
            sistema.checked = false;
        } else if (numChecked === items) {
            sistema.checked = true;
        }
    }

    selectFormulario(checked: boolean, formulario, subMenu, sistema) {
        formulario.checked = checked;

        if (subMenu.SubItems.filter(si => si.checked).length === 0) {
            subMenu.checked = false;
        }

        if (subMenu.SubItems.filter(si => si.checked).length === subMenu.SubItems.length) {
            subMenu.checked = true;
        }

        let numChecked = 0;
        let items = 0;
        sistema.Items.forEach(
            i => {
                i.SubItems.forEach(
                    si => {
                        if (si.checked) {
                            numChecked++;
                        }
                        items++;
                    }
                );
            }
        );

        if (numChecked === 0) {
            sistema.checked = false;
        } else if (numChecked === items) {
            sistema.checked = true;
        }
    }

    checkedSubMenu(sistema): boolean {
        let checked = 0;
        let items = 0;
        sistema.Items.forEach(
            i => {
                i.SubItems.forEach(
                    si => {
                        if (si.checked) {
                            checked++;
                        }
                        items++;
                    }
                );
            }
        );

        return checked > 0 && checked !== items;
    }


    checkedFormulario(subMenu): boolean {
        return subMenu.SubItems.filter(si => si.checked).length > 0 && subMenu.SubItems.length !== subMenu.SubItems.filter(si => si.checked).length;
    }

}
