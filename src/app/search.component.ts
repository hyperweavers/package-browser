import { Component, OnInit }      from '@angular/core';
import { ElementRef, ViewChild }  from '@angular/core';
import { Router }                 from '@angular/router';

import { Observable }             from 'rxjs/Observable';
import { Subject }                from 'rxjs/Subject';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { Package }        from './package';
import { PackageService } from './package.service';

@Component({
  selector: 'search-page',
  templateUrl: './search.component.html',
  styleUrls: [ './search.component.css' ]
})

export class SearchComponent implements OnInit {
  @ViewChild('searchBox') searchBox:ElementRef;

  private keywords = new Subject<string>();

  packages: Observable<Package[]>;
  totalPackages: number;
  page: number = 1;
  sortBy: string = 'top';

  constructor(
    private packageService: PackageService,
    private router: Router) {
    packageService.count$.subscribe(count => this.totalPackages = count);
  }

  search(keyword: string): void {
    this.page = 1;
    this.sortBy = 'top';

    this.keywords.next(keyword);
  }

  sortPackages(sortBy: string): void {
    this.page = 1;
    this.sortBy = sortBy;

    this.keywords.next(this.searchBox.nativeElement.value);
  }

  loadPage(pageNumber: number): void {
    this.page = pageNumber;

    this.keywords.next(this.searchBox.nativeElement.value);

    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.packages = this.keywords
      .switchMap(keyword => keyword
        ? this.packageService.searchByKeyword(keyword, this.sortBy, this.page)
        : Observable.of<Package[]>([]))
      .catch(error => {
        console.log(error);

        return Observable.of<Package[]>([]);
      });
  }

  ngAfterViewInit(): void {
    this.searchBox.nativeElement.focus();
  }
}
