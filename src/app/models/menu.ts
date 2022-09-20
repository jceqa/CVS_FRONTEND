import {Sistema} from './sistema';
import {SubMenu} from './subMenu';

export interface Menu {
    sistemas: Sistema[];
    subMenus: SubMenu[];
}
