import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Participantspage } from './pages/participantspage/participantspage';
import { ParticipantRegisterationForm } from './pages/participant-registeration-form/participant-registeration-form';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'participants', component: Participantspage},
    {path: 'participants/new', component: ParticipantRegisterationForm},
    {path: 'participants/edit/:id', component: ParticipantRegisterationForm},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
