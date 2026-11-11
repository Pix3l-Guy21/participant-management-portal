import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Participantspage } from './participantspage/participantspage';
import { ParticipantRegisterationForm } from './participant-registeration-form/participant-registeration-form';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'participants', component: Participantspage},
    {path: 'participants/new', component: ParticipantRegisterationForm},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
