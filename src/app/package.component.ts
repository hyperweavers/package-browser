import { Component, OnInit }        from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable }               from 'rxjs/Observable';

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
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.packageService.getPackage(params.get('name')))
      .subscribe(pkg => this.package = pkg);
  }
}
