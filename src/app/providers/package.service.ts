import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable, Subject, of } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { Package } from '../entities/package';

@Injectable()
export class PackageService {
  private baseUrl: string = 'https://registry.npmjs.org';
  private corsAnywhereUrl: string = 'https://cors-anywhere.herokuapp.com/';
  private npmPkgUrl: string = 'https://www.npmjs.com/package/';
  private packagesPerPage: number = 18;
  private queryResultCount: Subject<number>;

  count$: Observable<number>;

  constructor(private http: Http) {
    this.queryResultCount = new Subject<number>();
    this.queryResultCount.next(0);
    this.count$ = this.queryResultCount.asObservable();
  }

  searchByKeyword(keyword: string, sortBy?: string, page?: number): Observable<Package[]> {
    let url = '';
    let from = 0;

    switch (sortBy) {
      case 'popularity':
        url = `${this.baseUrl}/-/v1/search?popularity=1.0&quality=0.0&maintenance=0.0`;
        break;

      case 'quality':
        url = `${this.baseUrl}/-/v1/search?popularity=0.0&quality=1.0&maintenance=0.0`;
        break;

      case 'maintenance':
        url = `${this.baseUrl}/-/v1/search?popularity=0.0&quality=0.0&maintenance=1.0`;
        break;

      case 'top':
      default:
        url = `${this.baseUrl}/-/v1/search?popularity=1.0&quality=1.0&maintenance=1.0`;
        break;
    }

    if (page) {
      from = (page - 1) * this.packagesPerPage;
    }

    return this.http
      .get(`${url}&text=${keyword}&from=${from}&size=${this.packagesPerPage}`)
      .pipe(
        map(this.mapPackages.bind(this))
      );
  }

  searchByAuthor(author: string, sortBy?: string, page?: number): Observable<Package[]> {
    let url = '';
    let from = 0;

    switch (sortBy) {
      case 'popularity':
        url = `${this.baseUrl}/-/v1/search?popularity=1.0&quality=0.0&maintenance=0.0`;
        break;

      case 'quality':
        url = `${this.baseUrl}/-/v1/search?popularity=0.0&quality=1.0&maintenance=0.0`;
        break;

      case 'maintenance':
        url = `${this.baseUrl}/-/v1/search?popularity=0.0&quality=0.0&maintenance=1.0`;
        break;

      case 'top':
      default:
        url = `${this.baseUrl}/-/v1/search?popularity=1.0&quality=1.0&maintenance=1.0`;
        break;
    }

    if (page) {
      from = (page - 1) * this.packagesPerPage;
    }

    return this.http
      .get(`${url}&text=author:${author}&from=${from}&size=${this.packagesPerPage}`)
      .pipe(
        map(this.mapPackages.bind(this))
      );
  }

  getPackage(name: string): Promise<Package> {
    return this.http
      .get(`${this.corsAnywhereUrl}${this.baseUrl}/${name}`)
      .toPromise()
      .then(this.mapPackage.bind(this))
      .catch(this.handleError);
  }

  getPackages(sortBy: string, page?: number): Observable<Package[]> {
    let url = '';
    let from = 0;

    switch (sortBy) {
      case 'popularity':
        url = `${this.baseUrl}/-/v1/search?popularity=1.0&quality=0.0&maintenance=0.0&text=boost-exact:true`;
        break;

      case 'quality':
        url = `${this.baseUrl}/-/v1/search?popularity=0.0&quality=1.0&maintenance=0.0&text=boost-exact:true`;
        break;

      case 'maintenance':
        url = `${this.baseUrl}/-/v1/search?popularity=0.0&quality=0.0&maintenance=1.0&text=boost-exact:true`;
        break;

      case 'top':
      default:
        url = `${this.baseUrl}/-/v1/search?popularity=1.0&quality=1.0&maintenance=1.0&text=boost-exact:true`;
        break;
    }

    if (page) {
      from = (page - 1) * this.packagesPerPage;
    }

    return this.http
      .get(`${url}&from=${from}&size=${this.packagesPerPage}`)
      .pipe(
        share(),
        map(this.mapPackages.bind(this))
      );
  }

  private mapPackage(response: Response, packageName: string): Package {
    this.queryResultCount.next(1);

    const res = response.json();

    let pkg = null;

    if (res.error === undefined && res.reason === undefined) {
      const repoUrl = res.repository.url ? this.sanitizeUrl(res.repository.url) : '';

      const dependencyList = [];

      for (const dependency in res.versions[res['dist-tags'].latest].dependencies) {
        if (dependency !== undefined && dependency !== null) {
          dependencyList.push(dependency);
        }
      }

      pkg = <Package>({
        name: res.name,
        version: res['dist-tags'].latest,
        desc: res.description,
        authorUsername: res.versions[res['dist-tags'].latest]._npmUser.name,
        authorEmail: res.versions[res['dist-tags'].latest]._npmUser.email,
        authorName: (res.author && res.author.name) ? res.author.name : '',
        keywords: res.keywords,
        homepage: res.homepage ? res.homepage : '',
        repoType: res.repository.type ? res.repository.type : '',
        repoUrl: repoUrl,
        npmUrl: this.npmPkgUrl + res.name,
        publishDate: res.time.created,
        prettyPublishDate: this.prettyDate(res.time.created),
        lastModifiedTime: res.time.modified,
        prettyLastModifiedTime: this.prettyDate(res.time.modified),
        authorWebsite: (res.author && res.author.url) ? res.author.url : '',
        downloadUrl: res.versions[res['dist-tags'].latest].dist.tarball,
        license: res.license ? res.license : '',
        readme: res.readme ? this.normalizeReadme(res.readme, repoUrl) : '',
        dependencies: dependencyList
      });
    }

    return pkg;
  }

  private mapPackages(response: Response): Observable<Package[]> {
    const res = response.json();

    if (res.objects.length > 0) {
      console.log('Results found!');

      this.queryResultCount.next(res.total);

      return res.objects.map(this.toPackage.bind(this));
    } else {
      console.log('No results found for the given keyword!');

      this.queryResultCount.next(0);

      return of<Package[]>([]);
    }
  }

  private toPackage(obj: any): Package {
    let repoType = '';

    if (obj.package.links.repository) {
      if (this.isGithubUrl(obj.package.links.repository) === true) {
        repoType = 'git';
      }
    }

    const starRating = Math.round((obj.score.final * 10) / 2);
    const starImages = [];

    for (let i = 0; i < 5; ++i) {
      if (i < starRating) {
        starImages.push('assets/img/icon-star-filled-20px.svg');
      } else {
        starImages.push('assets/img/icon-star-blank-20px.svg');
      }
    }

    const pkg = <Package>({
      name: obj.package.name,
      version: obj.package.version,
      desc: obj.package.description,
      authorUsername: obj.package.publisher.username,
      authorEmail: obj.package.publisher.email,
      authorName: (obj.package.author && obj.package.author.name) ? obj.package.author.name : '',
      keywords: obj.package.keywords,
      homepage: obj.package.links.homepage ? obj.package.links.homepage : '',
      repoType: repoType,
      repoUrl: obj.package.links.repository ? this.sanitizeUrl(obj.package.links.repository) : '',
      npmUrl: obj.package.links.npm ? obj.package.links.npm : this.npmPkgUrl + obj.package.name,
      publishDate: obj.package.date,
      prettyPublishDate: this.prettyDate(obj.package.date),
      rating: obj.score.final,
      stars: starImages
    });

    return pkg;
  }

  private isGithubUrl(url: string): boolean {
    return url.slice(0, 'http://github.com'.length) === 'http://github.com' ||
      url.slice(0, 'https://github.com'.length) === 'https://github.com' ||
      url.slice(0, 'git://github.com'.length) === 'git://github.com';
  }

  private sanitizeUrl(url: string): string {
    if (url.slice(url.length - '.git'.length, url.length) === '.git') {
      url = url.slice(0, url.length - '.git'.length);
    }

    if (url.slice(0, 'git+'.length) === 'git+') {
      return url.slice('git+'.length, url.length);
    }

    if (url.slice(0, 'git://'.length) === 'git://') {
      return 'http' + url.slice('git'.length, url.length);
    }

    return '';
  }

  private prettyDate(time: string): string {
    if (time.indexOf('.') !== -1) {
      time = time.slice(0, time.indexOf('.')) + 'Z';
    }

    const date1 = new Date((time || ''));
    const date2 = new Date();
    const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
    const diff = Math.abs((<any>date2) - (<any>date1));
    const diffObj = {
      years: Math.abs(date2.getFullYear() - date1.getFullYear()),
      months: Math.abs((date2.getFullYear() * 12 + date2.getMonth()) - (date1.getFullYear() * 12 + date1.getMonth())),
      weeks: Math.floor(diff / week),
      days: Math.floor(diff / day),
      hours: Math.floor(diff / hour),
      minutes: Math.floor(diff / minute),
      seconds: Math.floor(diff / second),
      milliseconds: Math.floor(diff % 1000)
    };

    let diffStr = '';

    if (diffObj.years > 0) {
      if (diffObj.years === 1) {
        diffStr = 'a year ago';
      } else {
        diffStr = diffObj.years + ' years ago';
      }
    } else if (diffObj.months > 0) {
      if (diffObj.months === 1) {
        diffStr = 'a month ago';
      } else {
        diffStr = diffObj.months + ' months ago';
      }
    } else if (diffObj.weeks > 0) {
      if (diffObj.weeks === 1) {
        diffStr = 'a week ago';
      } else {
        diffStr = diffObj.weeks + ' weeks ago';
      }
    } else if (diffObj.days > 0) {
      if (diffObj.days === 1) {
        diffStr = 'a day ago';
      } else {
        diffStr = diffObj.days + ' days ago';
      }
    } else if (diffObj.hours > 0) {
      if (diffObj.hours === 1) {
        diffStr = 'a hour ago';
      } else {
        diffStr = diffObj.hours + ' hours ago';
      }
    } else if (diffObj.minutes > 0) {
      if (diffObj.minutes === 1) {
        diffStr = 'a minute ago';
      } else {
        diffStr = diffObj.minutes + ' minutes ago';
      }
    } else if (diffObj.seconds > 0) {
      if (diffObj.seconds === 1) {
        diffStr = 'a second ago';
      } else {
        diffStr = diffObj.seconds + ' seconds ago';
      }
    } else {
      if (diffObj.milliseconds >= 1) {
        diffStr = diffObj.milliseconds + ' milliseconds ago';
      } else if (diffObj.milliseconds === 1) {
        diffStr = 'a millisecond ago';
      } else {
        diffStr = 'just now';
      }
    }

    return diffStr;
  }

  private normalizeReadme(readme: string, repoUrl: string): string {
    const absoluteUrlRegExp = new RegExp('^(?:[a-z]+:)?//', 'i');

    const urls = readme.match(/(?:!\[(.*?)\]\((.*?)\))/g);

    if (urls !== null) {
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i].match(/(\(.*?)\)/g)[0];
        let relativePath = url.slice(1, url.length - 1);

        if (relativePath[0] === '/') {
          relativePath = relativePath.slice(1, relativePath.length);
        }

        if (absoluteUrlRegExp.test(relativePath) === false) {
          if (repoUrl !== '') {
            if (repoUrl[repoUrl.length] === '/') {
              repoUrl = repoUrl.slice(0, repoUrl.length - 1);
            }

            readme = readme.replace(url, '(' + repoUrl + '/raw/master/' + relativePath + ')');
          }
        }
      }
    }

    return readme;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);

    return Promise.reject(error.message || error);
  }
}
