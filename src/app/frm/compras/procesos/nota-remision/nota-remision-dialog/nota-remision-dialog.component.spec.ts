import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaRemisionDialogComponent } from './nota-remision-dialog.component';

describe('NotaRemisionDialogComponent', () => {
  let component: NotaRemisionDialogComponent;
  let fixture: ComponentFixture<NotaRemisionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaRemisionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaRemisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
