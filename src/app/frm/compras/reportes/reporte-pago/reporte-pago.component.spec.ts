import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePagoComponent } from './reporte-pago.component';

describe('ReportePagoComponent', () => {
  let component: ReportePagoComponent;
  let fixture: ComponentFixture<ReportePagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportePagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
