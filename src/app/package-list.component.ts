import { Component, OnInit }        from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router }                   from '@angular/router';

import { Observable }               from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';

import { Package }        from './package';
import { PackageService } from './package.service';

@Component({
  selector: 'package-list',
  templateUrl: './package-list.component.html',
  styleUrls: [ './package-list.component.css' ]
})

export class PackageListComponent implements OnInit {
  packages: Package[] = [];
  totalPackages: number;
  page: number = 1;
  sortBy: string;

  constructor(
    private packageService: PackageService,
    private route: ActivatedRoute,
    private router: Router) {
    packageService.count$.subscribe(count => this.totalPackages = count);
  }

  loadSearchPage(): void {
    this.router.navigate(['/search']);
  }

  sortPackages(sortBy: string): void {
    this.page = 1;

    this.router.navigate(['/list/' + sortBy]);
  }

  loadPage(pageNumber: number): void {
    this.page = pageNumber;

    this.packages = [];

    this.packageService.getPackages(this.sortBy, this.page).subscribe(packages => this.packages = packages);
  }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.loadPackages(params.get('sortBy')))
      .subscribe(packages => {
        this.packages = packages;
      });
  }

  private loadPackages(sortBy: string): Observable<Package[]> {
    this.packages = [];

    this.sortBy = sortBy;

    return this.packageService.getPackages(this.sortBy);
  }
}
