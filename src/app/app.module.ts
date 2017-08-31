import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';

import { MarkdownModule }   from 'angular2-markdown';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }     from './app.component';
import { CardComponent }    from './card.component';
import { HomeComponent }    from './home.component';
import { SearchComponent }  from './search.component';
import { PackageComponent } from './package.component';
import { AuthorComponent }  from './author.component';

import { PackageService }   from './package.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MarkdownModule.forRoot(),
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    CardComponent,
    HomeComponent,
    SearchComponent,
    PackageComponent,
    AuthorComponent
  ],
  providers: [ PackageService ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}
