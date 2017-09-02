import { Component, OnInit }                from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Observable }                       from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';

import { Package }        from './package';
import { Author }         from './author';
import { PackageService } from './package.service';
import { AuthorService }  from './author.service';

@Component({
  selector: 'author-page',
  templateUrl: './author.component.html',
  styleUrls: [ './author.component.css' ],
  providers: [ AuthorService ]
})

export class AuthorComponent implements OnInit {
  packages: Package[];
  author: Author;
  authorUsername: string;
  totalPackages: number;
  page: number = 1;
  sortBy: string = 'top';

  constructor(
    private packageService: PackageService,
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router) {
    packageService.count$.subscribe(count => this.totalPackages = count);
  }

  loadSearchPage(): void {
    this.router.navigate(['/search']);
  }

  sortPackages(sortBy: string): void {
    this.page = 1;
    this.sortBy = sortBy;

    this.packages = [];

    this.packageService.searchByAuthor(this.authorUsername, this.sortBy, this.page).subscribe(packages => this.packages = packages);
  }

  loadPage(pageNumber: number): void {
    this.page = pageNumber;

    this.packages = [];

    this.packageService.searchByAuthor(this.authorUsername, this.sortBy, this.page).subscribe(packages => this.packages = packages);
  }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.loadPackages(params.get('name')))
      .subscribe(packages => {
        this.packages = packages;
      });

    this.route.paramMap
      .switchMap((params: ParamMap) => this.authorService.getAuthor(params.get('name')))
      .subscribe(author => this.author = author);
  }

  private loadPackages(authorUsername: string): Observable<Package[]> {
    this.packages = [];

    this.authorUsername = authorUsername;

    return this.packageService.searchByAuthor(this.authorUsername, this.sortBy, this.page);
  }
}
