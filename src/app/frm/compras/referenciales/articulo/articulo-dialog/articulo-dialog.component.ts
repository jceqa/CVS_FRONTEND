import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormType } from '../../../../../models/enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticuloService } from '../../../../../services/articulo.service';
import { UIService } from '../../../../../services/ui.service';
import {Marca} from '../../../../../models/marca';
import {TipoArticulo} from '../../../../../models/tipoArticulo';
import {Impuesto} from '../../../../../models/impuesto';
import {MarcaService} from '../../../../../services/marca.service';
import {TipoArticuloService} from '../../../../../services/tipoarticulo.service';
import {ImpuestoService} from '../../../../../services/impuesto.service';
import {Articulo} from '../../../../../models/articulo';

@Component({
    selector: 'app-articulo-dialog',
    templateUrl: './articulo-dialog.component.html',
    styleUrls: ['./articulo-dialog.component.css']
})
export class ArticuloDialogComponent implements OnInit {

    item: Articulo;
    companyId = 0;
    form: FormGroup;

    formType: FormType;

    title: String;
    editID: number;

    marcas: Marca[] = [];
    tipoArticulos: TipoArticulo[] = [];
    impuestos: Impuesto[] = [];

    constructor(
        // private store: Store<fromRoot.State>,
        private dialogRef: MatDialogRef<ArticuloDialogComponent>,
        private uiService: UIService,
        private articuloService: ArticuloService,
        private marcaService: MarcaService,
        private tipoArticuloService: TipoArticuloService,
        private impuestoService: ImpuestoService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data) {
            this.item = data.item;
        }
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            id: new FormControl('', []),
            descripcion: new FormControl('', [Validators.required]),
            precioVenta: new FormControl('', [Validators.required]),
            precioCompra: new FormControl('', [Validators.required]),
            codigo: new FormControl('', [Validators.required]),
            marca: new FormControl('', [Validators.required]),
            impuesto: new FormControl('', [Validators.required]),
            tipo: new FormControl('', [Validators.required]),
        });

        if (this.data.item.id && this.data != null) {
            // Si existe id, es una edicion, se recupera el objeto a editar y se setean los campos
            this.title = 'Editar';
            this.editID = this.data.item.id;
            this.getArticuloById(this.data.item.id);
            this.formType = FormType.EDIT;
            // this.setForm(this.item);
        } else {
            // Si no existe es una nueva lista
            this.title = 'Nuevo';
            this.formType = FormType.NEW;
        }

        this.marcaService.getMarcas().subscribe(
            (data) => {
                console.log(data);
                this.marcas = data;
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

        this.impuestoService.getImpuestos().subscribe(
            (data) => {
                console.log(data);
                this.impuestos = data;
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

        this.tipoArticuloService.getTipoArticulos().subscribe(
            (data) => {
                console.log(data);
                this.tipoArticulos = data;
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

    compareFunction(o1: any, o2: any) {
        return (o1 && o2 && o1.id === o2.id);
    }

    getArticuloById(id: number): void {

        // Realiza la llamada http para obtener el objeto
        this.articuloService.getArticuloById(id).subscribe(
            data => {
                this.item = data as Articulo;
                this.setForm(this.item);
            }, (error) => {
                console.error(error);
            });
    }

    // Rellena los campos del formulario con los valores dados
    setForm(item: Articulo) {
        console.log(item);
        if (this.formType === FormType.EDIT) {
            this.form.patchValue({
                id: item.id,
                descripcion: item.descripcion,
                precioCompra: item.precioCompra,
                precioVenta: item.precioVenta,
                codigo: item.codigoGenerico,
                marca: item.marca,
                impuesto: item.impuesto,
                tipo: item.tipoArticulo,
            });
        }
    }

    // Asigna los valores del formulario al objeto de tipo {PriceListDraft}
    setAtributes(): void {
        this.item.id = this.form.get('id').value;
        this.item.descripcion = this.form.get('descripcion').value.toString().toUpperCase().trim();
        this.item.precioCompra = parseInt(this.form.get('precioCompra').value.toString().replace(/[.]/g, ''), 10);
        this.item.precioVenta = parseInt(this.form.get('precioVenta').value.toString().replace(/[.]/g, ''), 10);
        this.item.codigoGenerico = this.form.get('codigo').value;
        this.item.marca = this.form.get('marca').value;
        this.item.impuesto = this.form.get('impuesto').value;
        this.item.tipoArticulo = this.form.get('tipo').value;
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
        console.log(this.item);

        // Llama al servicio que almacena el objeto {PriceListDraft}
        this.articuloService.guardarArticulo(this.item)
            .subscribe(data => {
                    console.log(data);
                    this.dialogRef.close(data);

                    this.uiService.showSnackbar(
                        'Argregado exitosamente.',
                        'Cerrar',
                        3000
                    );
                },
                (error) => {

                    console.error('[ERROR]: ', error);

                    this.uiService.showSnackbar(
                        'Ha ocurrido un error.',
                        'Cerrar',
                        3000
                    );

                }
            );
    }

    // Metodo que modifica un objeto {PriceListDraft} en base de datos
    edit(): void {

        // Asigna los valores del formulario al objeto a almacenar
        console.log(this.item);
        this.setAtributes();
        console.log(this.item);

        // Llama al servicio http que actualiza el objeto.
        this.articuloService.editarArticulo(this.item)
            .subscribe(data => {
                    console.log(data);

                    this.uiService.showSnackbar(
                        'Modificado exitosamente.',
                        'Cerrar',
                        3000
                    );

                    this.dialogRef.close(data);
                },
                (error) => {
                    console.error('[ERROR]: ', error);

                    this.uiService.showSnackbar(
                        error.error ? error.error : 'Ha ocurrido un error.',
                        'Cerrar',
                        5000
                    );
                }
            );
    }

    setNumber($event, type) {
        this.form.get(type).setValue($event.target.value);
    }
}
