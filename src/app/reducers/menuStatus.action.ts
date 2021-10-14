import {Action} from '@ngrx/store';

export  const OPEN = '[Menu] OPEN MENU';
export  const CLOSE = '[Menu] CLOSE MENU';


export class OpenMenuAction implements Action {
  readonly type = OPEN;
}

export class CloseMenuAction implements Action {
  readonly type = CLOSE;
}

export type actions = OpenMenuAction | CloseMenuAction;
