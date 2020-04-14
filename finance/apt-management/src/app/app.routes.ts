import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { AuthenticationGuard } from './guards/authentication.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    },
    {
        path: 'debit',
        canActivate: [AuthenticationGuard],
        loadChildren: './debit/debit.module#DebitModule'
    },
    {
        path: 'credit',
        canActivate: [AuthenticationGuard],
        loadChildren: './credit/credit.module#CreditModule'
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

export const AppRoutes = RouterModule.forRoot(routes);
