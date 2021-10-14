import * as fromTranslator from './trasnlator.action';

export function translatorReducer(state: string = 'es', action: fromTranslator.actions) {
  switch (action.type) {
    case fromTranslator.SPANISH:
      return 'es'
    case fromTranslator.ENGLISH:
      return 'en'
    case fromTranslator.PORTUGUESE:
      return 'pt'
    default:
      return state;
  }
}
