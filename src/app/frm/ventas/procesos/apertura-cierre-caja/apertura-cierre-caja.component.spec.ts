import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AperturaCierreCajaComponent } from './apertura-cierre-caja.component';

describe('AperturaCierreCajaComponent', () => {
  let component: AperturaCierreCajaComponent;
  let fixture: ComponentFixture<AperturaCierreCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AperturaCierreCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AperturaCierreCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
