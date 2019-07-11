import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'buildmodel'
    },
    {
        path: 'buildmodel',
        loadChildren: './build-model/build-model.module#BuildModelModule'
    },
    {
        path: 'buildui',
        loadChildren: './build-ui/build-ui.module#BuildUiModule'
    }
];

export let AppRoutes = RouterModule.forRoot(routes);
