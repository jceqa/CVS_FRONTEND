import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenCompraDialogComponent } from './orden-compra-dialog.component';

describe('OrdenCompraDialogComponent', () => {
  let component: OrdenCompraDialogComponent;
  let fixture: ComponentFixture<OrdenCompraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenCompraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenCompraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
