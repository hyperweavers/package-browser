import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MarkdownModule } from 'ngx-markdown';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { HomeComponent } from './pages/home/home.component';
import { PackageListComponent } from './pages/package-list/package-list.component';
import { SearchComponent } from './pages/search/search.component';
import { PackageComponent } from './pages/package/package.component';
import { AuthorComponent } from './pages/author/author.component';

import { PackageService } from './providers/package.service';
import { LoaderService } from './providers/loader.service';

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
  bootstrap: [AppComponent]
})

export class AppModule { }
