import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaDebitoCompraDialogComponent } from './nota-debito-compra-dialog.component';

describe('NotaDebitoCompraDialogComponent', () => {
  let component: NotaDebitoCompraDialogComponent;
  let fixture: ComponentFixture<NotaDebitoCompraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaDebitoCompraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaDebitoCompraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
