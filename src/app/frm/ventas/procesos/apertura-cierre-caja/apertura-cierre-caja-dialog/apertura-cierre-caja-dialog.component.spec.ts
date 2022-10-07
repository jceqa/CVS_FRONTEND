import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AperturaCierreCajaDialogComponent } from './apertura-cierre-caja-dialog.component';

describe('AperturaCierreCajaDialogComponent', () => {
  let component: AperturaCierreCajaDialogComponent;
  let fixture: ComponentFixture<AperturaCierreCajaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AperturaCierreCajaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AperturaCierreCajaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
