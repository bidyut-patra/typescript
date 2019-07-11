import { Route, RouterModule } from '@angular/router';
import { BuildModelComponent } from './build-model.component';

const routes: Route[] = [
    {
        path: '',
        component: BuildModelComponent
    }
];

export let BuildModelRoutes = RouterModule.forChild(routes);
