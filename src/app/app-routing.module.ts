import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }        from './pages/home/home.component';
import { PackageListComponent } from './pages/package-list/package-list.component';
import { SearchComponent }      from './pages/search/search.component';
import { PackageComponent }     from './pages/package/package.component';
import { AuthorComponent }      from './pages/author/author.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'list/:sortBy', component: PackageListComponent },
  { path: 'search', component: SearchComponent },
  { path: 'package/:name', component: PackageComponent },
  { path: 'author/:name', component: AuthorComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
