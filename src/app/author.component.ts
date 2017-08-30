import { Component, OnInit }        from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable }               from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { Package }        from './package';
import { Author }         from './author';
import { PackageService } from './package.service';
import { AuthorService }  from './author.service';

@Component({
  selector: 'author-page',
  templateUrl: './author.component.html',
  styleUrls: [ './author.component.css' ],
  providers: [ AuthorService ]
})

export class AuthorComponent implements OnInit {
  packages: Observable<Package[]>;
  author: Author;

  constructor(
    private packageService: PackageService,
    private authorService: AuthorService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.packages = this.route.paramMap
      .switchMap((params: ParamMap) => params
        ? this.packageService.searchByAuthor(params.get('name'))
        : Observable.of<Package[]>([]))
      .catch(error => {
        console.log(error);

        return Observable.of<Package[]>([]);
      });

    this.route.paramMap
      .switchMap((params: ParamMap) => this.authorService.getAuthor(params.get('name')))
      .subscribe(author => this.author = author);
  }
}
