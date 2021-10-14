export enum FormType {
    NEW,
    EDIT,
    VIEW
}

export enum Browser {
    OPERA,
    FIREFOX,
    SAFARI,
    IE,
    EDGE,
    CHROME,
    UNKNOWN
}

export enum RecordState {
    NEW,
    DELETED
}

// Estados de Autorizacion (referente a las autorizaciones por memo)
export enum AuthorizationStatus {
  NONE,
  OK,
  DENIED,
  PENDING
}
