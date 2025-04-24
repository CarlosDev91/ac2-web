import { Routes } from '@angular/router';
import { InscricaoConferenciaComponent } from './inscricao-conferencia/inscricao-conferencia.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inscricao', pathMatch: 'full' },
  { path: 'inscricao', component: InscricaoConferenciaComponent }
];