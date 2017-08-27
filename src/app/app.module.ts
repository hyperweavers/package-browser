import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }     from './app.component';
import { CardComponent }    from './card.component';

import { PackageService }   from './package.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    CardComponent
  ],
  providers: [ PackageService ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}