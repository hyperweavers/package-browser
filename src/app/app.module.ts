import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }     from './app.component';
import { HomeComponent }    from './home.component';
import { CardComponent }    from './card.component';
import { AuthorComponent }  from './author.component';

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
    HomeComponent,
    CardComponent,
    AuthorComponent
  ],
  providers: [ PackageService ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}