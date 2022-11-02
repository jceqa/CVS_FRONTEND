import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroVentaDialogComponent } from './libro-venta-dialog.component';

describe('LibroVentaDialogComponent', () => {
  let component: LibroVentaDialogComponent;
  let fixture: ComponentFixture<LibroVentaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibroVentaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibroVentaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
