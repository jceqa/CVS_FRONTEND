import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjusteDialogComponent } from './ajuste-dialog.component';

describe('AjusteDialogComponent', () => {
  let component: AjusteDialogComponent;
  let fixture: ComponentFixture<AjusteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjusteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjusteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
