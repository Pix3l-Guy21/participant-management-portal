import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Participantspage } from './pages/participantspage/participantspage';
import { ParticipantRegisterationForm } from './pages/participant-registeration-form/participant-registeration-form';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: 'login', component: Login},
    {
        path: 'participants',
        component: Participantspage,
        canActivate: [authGuard]
    },
    {
        path: 'participants/new',
        component: ParticipantRegisterationForm,
        canActivate: [authGuard]
    },
    {
        path: 'participants/edit/:id', 
        component: ParticipantRegisterationForm,
        canActivate: [authGuard]
    },
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
