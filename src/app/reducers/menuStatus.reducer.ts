import * as fromMenuStatus from './menuStatus.action';

export function menuStatusReducer(state: boolean = true, action: fromMenuStatus.actions) {
  switch (action.type) {
    case fromMenuStatus.OPEN:
      return true
    case fromMenuStatus.CLOSE:
      return false
    default:
      return state;
  }
}
