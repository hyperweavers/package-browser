import { Component, OnInit }                from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Observable }                       from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';

import { Package }        from './package';
import { PackageService } from './package.service';

@Component({
  selector: 'package-page',
  templateUrl: './package.component.html',
  styleUrls: [ './package.component.css' ]
})

export class PackageComponent implements OnInit {
  package: Package;

  constructor(
    private packageService: PackageService,
    private route: ActivatedRoute,
    private router: Router) {}

  loadSearchPage(): void {
    this.router.navigate(['/search']);
  }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.packageService.getPackage(params.get('name')))
      .subscribe(pkg => this.package = pkg);
  }
}
