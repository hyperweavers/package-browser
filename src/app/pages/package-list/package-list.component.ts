import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { switchMap } from 'rxjs/operators';

import { Package } from '../../entities/package';
import { PackageService } from '../../providers/package.service';
import { LoaderService } from '../../providers/loader.service';

@Component({
  selector: 'pb-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})

export class PackageListComponent implements OnInit {
  packages: Package[] = [];
  totalPackages: number;
  page: number = 1;
  sortBy: string;

  constructor(
    private packageService: PackageService,
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

    this.router.navigate(['/list/' + sortBy]);
  }

  loadPage(pageNumber: number): void {
    this.loaderService.show();

    this.page = pageNumber;

    this.packages = [];

    this.packageService.getPackages(this.sortBy, this.page).subscribe(packages => {
      this.packages = packages;

      this.loaderService.hide();
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => this.loadPackages(params.get('sortBy')))
      )
      .subscribe(packages => {
        this.packages = packages;

        this.loaderService.hide();
      });
  }

  private loadPackages(sortBy: string): Observable<Package[]> {
    this.packages = [];

    this.sortBy = sortBy;

    return this.packageService.getPackages(this.sortBy);
  }
}
