import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { AppSettings } from 'src/appsettings';
import { HttpModule } from '@angular/http';
import { AppRoutes } from './app.routes';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthenticationGuard } from './guards/authentication.guard';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutes
  ],
  providers: [
    AppSettings,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: AppSettings) => () => config.load(), deps: [AppSettings], multi: true
    },
    AuthenticationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
