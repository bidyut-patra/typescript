import { Routes, RouterModule } from '@angular/router';
import { CreditComponent } from './credit.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CreditComponent
    }
];

export const CreditRoutes = RouterModule.forChild(routes);
