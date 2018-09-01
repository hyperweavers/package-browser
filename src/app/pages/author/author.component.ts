import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';

import { switchMap } from 'rxjs/operators';

import { Package } from '../../entities/package';
import { Author } from '../../entities/author';
import { PackageService } from '../../providers/package.service';
import { AuthorService } from '../../providers/author.service';
import { LoaderService } from '../../providers/loader.service';

@Component({
  selector: 'author-page',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css'],
  providers: [AuthorService]
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
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router) {
    loaderService.show();

    packageService.count$.subscribe(count => this.totalPackages = count);
  }

  loadSearchPage(): void {
    this.router.navigate(['/search']);
  }

  sortPackages(sortBy: string): void {
    this.loaderService.show();

    this.page = 1;
    this.sortBy = sortBy;

    this.packages = [];

    this.packageService.searchByAuthor(this.authorUsername, this.sortBy, this.page).subscribe(packages => {
      this.packages = packages;

      this.loaderService.hide();
    });
  }

  loadPage(pageNumber: number): void {
    this.loaderService.show();

    this.page = pageNumber;

    this.packages = [];

    this.packageService.searchByAuthor(this.authorUsername, this.sortBy, this.page).subscribe(packages => {
      this.packages = packages;

      this.loaderService.hide();
    });
  }

  ngOnInit(): void {
    let isPackagesLoaded = false;
    let isAuthorDetailsLoaded = false;

    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => this.loadPackages(params.get('name')))
      )
      .subscribe(packages => {
        this.packages = packages;

        isPackagesLoaded = true;

        if (isPackagesLoaded === true && isAuthorDetailsLoaded === true) {
          this.loaderService.hide();
        }
      });

    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => this.authorService.getAuthor(params.get('name')))
      )
      .subscribe(author => {
        this.author = author;

        isAuthorDetailsLoaded = true;

        if (isPackagesLoaded === true && isAuthorDetailsLoaded === true) {
          this.loaderService.hide();
        }
      });
  }

  private loadPackages(authorUsername: string): Observable<Package[]> {
    this.packages = [];

    this.authorUsername = authorUsername;

    return this.packageService.searchByAuthor(this.authorUsername, this.sortBy, this.page);
  }
}
