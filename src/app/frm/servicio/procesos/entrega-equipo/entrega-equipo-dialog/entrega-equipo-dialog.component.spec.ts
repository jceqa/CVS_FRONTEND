import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaEquipoDialogComponent } from './entrega-equipo-dialog.component';

describe('EntregaEquipoDialogComponent', () => {
    let component: EntregaEquipoDialogComponent;
    let fixture: ComponentFixture<EntregaEquipoDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EntregaEquipoDialogComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EntregaEquipoDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
