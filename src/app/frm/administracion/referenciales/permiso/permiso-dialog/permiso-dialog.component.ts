import {Component, Inject, OnInit} from '@angular/core';
import {Permiso} from '../../../../../models/permiso';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormType} from '../../../../../models/enum';
import {Sistema} from '../../../../../models/sistema';
import {SubMenu} from '../../../../../models/subMenu';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UIService} from '../../../../../services/ui.service';
import {PermisoService} from '../../../../../services/permiso.service';
import {UtilService} from '../../../../../services/util.service';
import {MenuService} from '../../../../../services/menu.service';
import {Formulario} from '../../../../../models/formulario';
import {FormularioService} from '../../../../../services/formulario.service';

@Component({
  selector: 'app-permiso-dialog',
  templateUrl: './permiso-dialog.component.html',
  styleUrls: ['./permiso-dialog.component.scss']
})
export class PermisoDialogComponent implements OnInit {

    item: Permiso;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    formularios: Formulario[];
    sistemas: Sistema[];
    subMenus: SubMenu[];
    menu;

    menuLoaded = false;
    formularioLoaded = false;

    colors = ['primary', 'accent', 'warn', 'success'];

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<PermisoDialogComponent>,
        private uiService: UIService,
        private permisoService: PermisoService,
        private utils: UtilService,
        private menuService: MenuService,
        private formularioService: FormularioService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            nombre: new FormControl('', [Validators.required]),
            url: new FormControl('', [Validators.required]),
            sistema: new FormControl('', [Validators.required]),
            subMenu: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getPermisoById(this.data.item.id);
            this.formType = FormType.EDIT;
            // this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.utils.startLoading();
        this.menuService.getMenu().subscribe( data => {
                console.log(data);
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
                console.log(data);
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

    getPermisoById(id: number): void {

        // Realiza la llamada http para obtener el objeto
        this.permisoService.getPermisoById(id).subscribe(
            data => {
                this.item = data as Permiso;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    // Rellena los campos del permiso con los valores dados
    setForm(item: Permiso) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                /*nombre: item.nombre,
                url: item.url,
                sistema: item.sistema,
                subMenu: item.subMenu*/
            });
        }
    }

    // Asigna los valores del permiso al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        /*this.item.nombre = this.form.get('nombre').value;
        this.item.url = this.form.get('url').value;
        this.item.sistema = this.form.get('sistema').value;
        this.item.subMenu = this.form.get('subMenu').value;*/
    }

    dismiss(result?: any) {
        this.dialogRef.close(result);
    }

    uploadListItem(dato) {
        console.log(dato);
    }

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
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
        // if (this.utils.tieneLetras(this.item.nombre)) {
            // Llama al servicio que almacena el objeto {PriceListDraft}
            this.permisoService.guardarPermiso(this.item)
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
        /*} else {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
        }*/
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {
        // Asigna los valores del permiso al objeto a almacenar
        this.setAtributes();
        // Llama al servicio http que actualiza el objeto.
        // f (this.utils.tieneLetras(this.item.nombre)) {
            this.permisoService.editarPermiso(this.item).subscribe(data => {
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
        /*} else {
            this.uiService.showSnackbar(
                'La descripción no puede ser solo númerica.',
                'Cerrar',
                5000
            );
        }*/
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
                    Url : f.url,
                    Name : f.nombre,
                    checked: false
                })
            );

            console.log(newMenu);
            this.menu = newMenu;
        }
    }

    selectAll(checked: boolean) {
       /* this.allComplete = completed;
        if (this.task.subtasks == null) {
            return;
        }*/
        this.menu.sistemas.forEach(s => (s.checked = checked));
    }

    selectAllSubMenu(checked: boolean) {
        /* this.allComplete = completed;
         if (this.task.subtasks == null) {
             return;
         }*/
        this.menu.sistemas.forEach(s =>  {
            s.checked = checked;
            s.SubItems.forEach( si => {
                si.checked = checked;
            });
        });
    }

    checkedSubMenu(sistema): boolean {
        return this.menu.find( m => m.nombre = sistema.Name).Items.filter(si => si.checked).length > 0;
    }


    checkedFormulario(sistema, subMenu): boolean {
        return this.menu.find( m => m.nombre = sistema.Name).Items.find(s => s.nombre = subMenu.Name).SubItems.filter(si => si.checked).length > 0;
    }

}
