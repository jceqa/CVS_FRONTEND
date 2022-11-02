import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaACobrarDialogComponent } from './cuenta-a-cobrar-dialog.component';

describe('CuentaACobrarDialogComponent', () => {
  let component: CuentaACobrarDialogComponent;
  let fixture: ComponentFixture<CuentaACobrarDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaACobrarDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaACobrarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
