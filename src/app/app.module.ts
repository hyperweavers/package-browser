import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { MarkdownModule }       from 'angular2-markdown';
import { NgxPaginationModule }  from 'ngx-pagination';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import { CardComponent }        from './card.component';
import { HomeComponent }        from './home.component';
import { PackageListComponent } from './package-list.component';
import { SearchComponent }      from './search.component';
import { PackageComponent }     from './package.component';
import { AuthorComponent }      from './author.component';

import { PackageService }       from './package.service';
import { LoaderService }        from './loader.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MarkdownModule.forRoot(),
    NgxPaginationModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    CardComponent,
    HomeComponent,
    PackageListComponent,
    SearchComponent,
    PackageComponent,
    AuthorComponent
  ],
  providers: [
    PackageService,
    LoaderService
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule {}
