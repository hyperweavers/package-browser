import { Component, OnInit }      from '@angular/core';
import { Router }                 from '@angular/router';

import { Observable }             from 'rxjs/Observable';

import { Package }        from './package';
import { PackageService } from './package.service';

@Component({
  selector: 'package-list',
  templateUrl: './package-list.component.html',
  styleUrls: [ './package-list.component.css' ]
})

export class PackageListComponent implements OnInit {
  packages: Observable<Package[]>;

  constructor(
    private packageService: PackageService,
    private router: Router) {}

  loadSearchPage(): void {
    this.router.navigate(['/search']);
  }

  ngOnInit(): void {
    this.packages = this.packageService.getAllPackages();
  }
}
