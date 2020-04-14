import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AdminComponent
    }
];

export const AdminRoutes = RouterModule.forChild(routes);
