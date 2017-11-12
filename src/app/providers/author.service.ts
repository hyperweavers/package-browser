import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable }     from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

import { Author }         from '../entities/author';

@Injectable()
export class AuthorService {
  private baseUrl = 'https://api.github.com';

  constructor(private http: Http) {}

  getAuthor(name : string): Promise<Author> {
    return this.http
            .get(`${this.baseUrl}/users/${name}`)
            .toPromise()
            .then(this.mapAuthor)
            .catch(this.handleError);
  }

  private mapAuthor(response:Response): Author {
    let res = response.json();

    let url = '';

    if (res.blog !== undefined && res.blog !== null && res.blog !== '') {
      url = res.blog;
    } else {
      url = res.html_url;
    }

    let author = <Author>({
      userName: res.login,
      name: res.name,
      avatarUrl: res.avatar_url,
      homepage: url,
      company: res.company,
      location: res.location,
      email: res.email,
      bio: res.bio
    });

    return author;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);

    return Promise.reject(error.message || error);
  }
}
