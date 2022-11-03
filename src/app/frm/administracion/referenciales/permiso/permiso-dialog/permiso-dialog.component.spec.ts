import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisoDialogComponent } from './permiso-dialog.component';

describe('PermisoDialogComponent', () => {
  let component: PermisoDialogComponent;
  let fixture: ComponentFixture<PermisoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermisoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
