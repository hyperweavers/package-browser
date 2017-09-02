import { Component, OnInit }  from '@angular/core';
import { Router }             from '@angular/router';

import { Observable }         from 'rxjs/Observable';

import { Package }        from './package';
import { PackageService } from './package.service';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
})

export class HomeComponent implements OnInit {
  packages: Observable<Package[]>;
  totalPackages: number;

  constructor(
    private packageService: PackageService,
    private router: Router) {}

  loadSearchPage(): void {
    this.router.navigate(['/search']);
  }

  ngOnInit(): void {
    this.packages = this.packageService.getPackages('popularity');

    this.packageService.getTotalPackagesCount()
      .then(pkgCount => this.totalPackages = pkgCount);
  }
}
