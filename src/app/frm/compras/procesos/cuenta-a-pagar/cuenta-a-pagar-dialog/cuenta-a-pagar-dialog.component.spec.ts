import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaAPagarDialogComponent } from './cuenta-a-pagar-dialog.component';

describe('CuentaAPagarDialogComponent', () => {
  let component: CuentaAPagarDialogComponent;
  let fixture: ComponentFixture<CuentaAPagarDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaAPagarDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaAPagarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
