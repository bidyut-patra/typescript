import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { NavigationModule } from './navigation/navigation.module';
import { AppRoutes } from './app.routes';
import { Clipboard } from './lib/misc/clipboard';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    HttpModule,
    NavigationModule,
    AppRoutes
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    Clipboard,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
