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
  sortBy: string;

  constructor(
    private packageService: PackageService,
    private route: ActivatedRoute,
    private router: Router) {}

  loadSearchPage(): void {
    this.router.navigate(['/search']);
  }

  sortPackages(sortBy: string): void {
    this.router.navigate(['/list/' + sortBy]);
  }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.loadPackages(params.get('sortBy')))
      .subscribe(packages => {
        this.packages = packages;
      });

    this.packageService.getTotalPackagesCount()
      .then(pkgCount => this.totalPackages = pkgCount);
  }

  private loadPackages(sortBy : string): Observable<Package[]> {
    this.packages = [];

    this.sortBy = sortBy;

    return this.packageService.getPackages(this.sortBy);
  }
}
