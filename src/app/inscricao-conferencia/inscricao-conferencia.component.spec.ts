import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscricaoConferenciaComponent } from './inscricao-conferencia.component';

describe('InscricaoConferenciaComponent', () => {
  let component: InscricaoConferenciaComponent;
  let fixture: ComponentFixture<InscricaoConferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscricaoConferenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscricaoConferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
