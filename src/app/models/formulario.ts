import { Sistema } from "./sistema";
import { SubMenu } from "./subMenu";

export interface Formulario {
    id : number;
    nombre : string;
    url : string;
    sistema : Sistema;
    subMenu : SubMenu;
}