import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject, of } from 'rxjs';

import { catchError, switchMap } from 'rxjs/operators';

import { Package } from '../../entities/package';
import { PackageService } from '../../providers/package.service';
import { LoaderService } from '../../providers/loader.service';

@Component({
  selector: 'pb-search-page',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild('searchBox') searchBox: ElementRef;

  private keywords: Subject<String> = new Subject<string>();

  packages: Observable<Package[]>;
  totalPackages: number;
  page: number = 1;
  sortBy: string = 'top';

  constructor(
    private packageService: PackageService,
    private loaderService: LoaderService,
    private router: Router) {
    packageService.count$.subscribe(count => this.totalPackages = count);
  }

  search(keyword: string): void {
    this.page = 1;
    this.sortBy = 'top';

    this.keywords.next(keyword);
  }

  sortPackages(sortBy: string): void {
    this.loaderService.show();

    this.page = 1;
    this.sortBy = sortBy;

    this.keywords.next(this.searchBox.nativeElement.value);
  }

  loadPage(pageNumber: number): void {
    this.loaderService.show();

    this.page = pageNumber;

    this.keywords.next(this.searchBox.nativeElement.value);

    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.packages = this.keywords
      .pipe(
        switchMap((keyword: string) => keyword
          ? this.packageService.searchByKeyword(keyword, this.sortBy, this.page)
          : of<Package[]>([])),
        catchError(error => {
          console.log(error);

          return of<Package[]>([]);
        })
      );

    this.packages.subscribe(packages => this.loaderService.hide());
  }

  ngAfterViewInit(): void {
    this.searchBox.nativeElement.focus();
  }
}
