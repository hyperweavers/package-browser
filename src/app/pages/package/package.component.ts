import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { Package } from '../../entities/package';
import { PackageService } from '../../providers/package.service';
import { LoaderService } from '../../providers/loader.service';

@Component({
  selector: 'pb-package-page',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})

export class PackageComponent implements OnInit {
  package: Package;

  constructor(
    private packageService: PackageService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router) {
    loaderService.show();
  }

  loadSearchPage(): void {
    this.router.navigate(['/search']);
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => this.packageService.getPackage(params.get('name')))
      )
      .subscribe(pkg => {
        this.package = pkg;

        this.loaderService.hide();
      });
  }
}
