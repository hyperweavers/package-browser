import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }        from './home.component';
import { SearchComponent }      from './search.component';
import { PackageComponent }     from './package.component';
import { AuthorComponent }      from './author.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'package/:name', component: PackageComponent },
  { path: 'author/:name', component: AuthorComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
