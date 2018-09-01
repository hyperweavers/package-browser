import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Package } from '../../entities/package';
import { PackageService } from '../../providers/package.service';
import { LoaderService } from '../../providers/loader.service';

@Component({
  selector: 'pb-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  packages: Observable<Package[]>;
  totalPackages: number;

  constructor(
    private packageService: PackageService,
    private loaderService: LoaderService,
    private router: Router) {
    loaderService.show();

    packageService.count$.subscribe(count => this.totalPackages = count);
  }

  loadSearchPage(): void {
    this.router.navigate(['/search']);
  }

  ngOnInit(): void {
    this.packages = this.packageService.getPackages('popularity');

    this.packages.subscribe(packages => this.loaderService.hide());
  }
}
