import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable }     from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Package }        from './package';

@Injectable()
export class PackageService {
  private baseUrl = 'https://registry.npmjs.org';

  constructor(private http: Http) {}

  searchByKeyword(keyword: string): Observable<Package[]> {
    return this.http
            .get(`${this.baseUrl}/-/v1/search?text=keywords:${keyword}`)
            .map(this.mapPackages.bind(this));
  }

  searchByAuthor(author: string): Observable<Package[]> {
    return this.http
            .get(`${this.baseUrl}/-/v1/search?text=author:${author}`)
            .map(this.mapPackages.bind(this));
  }

  private mapPackages(response:Response): Observable<Package[]> {
    let responseObjects = response.json().objects;

    if (responseObjects.length > 0) {
      console.log('Results found!');

      return response.json().objects.map(this.toPackage.bind(this));
    } else {
      console.info('No results found for the given keyword!');

      return Observable.of<Package[]>([]);
    }
  }

  private toPackage(obj:any): Package {
    let repoType = '';

    if (obj.package.links.repository !== undefined && obj.package.links.repository !== null && obj.package.links.repository.indexOf('github') !== -1) {
      repoType = 'git';
    }

    let starRating = Math.round((obj.score.final * 10) / 2);
    let starImages = [];

    for (let i = 0; i < 5; ++i) {
      if (i < starRating) {
        starImages.push('img/icon-star-filled-20px.svg');
      } else {
        starImages.push('img/icon-star-blank-20px.svg');
      }
    }

    let pkg = <Package>({
      name: obj.package.name,
      version: obj.package.version,
      desc: obj.package.description,
      authorName: obj.package.publisher.username,
      authorEmail: obj.package.publisher.email,
      keywords: obj.package.keywords,
      homepage: obj.package.links.homepage,
      repoType: repoType,
      repoUrl: obj.package.links.repository,
      npmUrl: obj.package.links.npm,
      publishDate: obj.package.date,
      rating: obj.score.final,
      stars: starImages
    });

    return pkg;
  }
}
