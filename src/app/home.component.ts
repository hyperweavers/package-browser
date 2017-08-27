import { Component, OnInit }  from '@angular/core';
import { Router }             from '@angular/router';

import { Observable }         from 'rxjs/Observable';
import { Subject }            from 'rxjs/Subject';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Package }        from './package';
import { PackageService } from './package.service';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
})

export class HomeComponent implements OnInit {
  packages: Observable<Package[]>;
  packages2: Observable<Package[]>;
  private keywords = new Subject<string>();

  constructor(
    private packageService: PackageService,
    private router: Router) {}

  search(keyword: string): void {
    this.keywords.next(keyword);
  }

  ngOnInit(): void {
    this.packages2 = this.packages = this.keywords
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(keyword => keyword.length > 1
        ? this.packageService.searchByKeyword(keyword)
        : Observable.of<Package[]>([]))
      .catch(error => {
        console.log(error);

        return Observable.of<Package[]>([]);
      });
  }
}