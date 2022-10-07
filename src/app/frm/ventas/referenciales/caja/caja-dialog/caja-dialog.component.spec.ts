import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaDialogComponent } from './caja-dialog.component';

describe('CajaDialogComponent', () => {
  let component: CajaDialogComponent;
  let fixture: ComponentFixture<CajaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CajaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CajaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
