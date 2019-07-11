import { Route, RouterModule } from '@angular/router';
import { BuildUiComponent } from './build-ui.component';

const routes: Route[] = [
    {
        path: '',
        component: BuildUiComponent
    }
];

export let BuildUiRoutes = RouterModule.forChild(routes);
