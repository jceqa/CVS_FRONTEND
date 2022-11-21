import { Sistema } from './sistema';
import { SubMenu } from './subMenu';

export class Formulario {
    id: number;
    nombre: string;
    url: string;
    estado: string;
    sistema: Sistema;
    subMenu: SubMenu;
}
