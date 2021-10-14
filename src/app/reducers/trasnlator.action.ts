import {Action} from '@ngrx/store';

export  const SPANISH = '[Translator] Spanish';
export  const ENGLISH = '[Translator] English';
export  const PORTUGUESE = '[Translator] Portuguese';

export class SpanishAction implements Action {
  readonly type = SPANISH;
}

export class EnglishAction implements Action {
  readonly type = ENGLISH;
}

export class PortugueseAction implements Action {
  readonly type = PORTUGUESE;
}

export type actions = SpanishAction | EnglishAction | PortugueseAction;
