import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Participantspage } from './participantspage/participantspage';

export const routes: Routes = [
    {path: 'login', component: Login},
    {path: 'participants', component: Participantspage},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
