import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaCreditoCompraDialogComponent } from './nota-credito-compra-dialog.component';

describe('NotaCreditoCompraDialogComponent', () => {
  let component: NotaCreditoCompraDialogComponent;
  let fixture: ComponentFixture<NotaCreditoCompraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaCreditoCompraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaCreditoCompraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
