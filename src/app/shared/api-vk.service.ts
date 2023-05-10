import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import * as queryString from 'querystring';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ApiVkService {

  public token = null;
  private url = 'https://api.vk.com';
  private versionApi = '5.101';
  private clientId = '7151733';

  constructor(
    private http: HttpClient
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
    }
  }

  groupsGetById(groupId: string, fields: string = '') {
    const params = {
      group_id: groupId,
      fields,
    };
    return this.getMethod('groups.getById', params);
  }

  wallGet(domain: string, count: number): Observable<any> {
    const params = {
      domain,
      count,
    };
    return this.getMethod('wall.get', params);
  }

  wallGetById(post: string) {
    const params = {
      posts: post
    };
    return this.getMethod('wall.getById', params);
  }

  wallGetComments(ownerId: number, postId: number, count: number = 10) {
    const params = {
      owner_id: ownerId,
      post_id: postId,
      count,
      thread_items_count: 10,
    };
    return this.getMethod('wall.getComments', params);
  }

  usersGet(userIds: number, fields: string) {
    const params = {
      user_ids: userIds,
      fields,
    };
    return this.getMethod('users.get', params);
  }

  likesGetList(type: string, ownerId: number, itemId: number, extended: number = 0, count: number = 100) {
    const params = {
      type,
      owner_id: ownerId,
      item_id: itemId,
      extended,
      count,
    };
    return this.getMethod('likes.getList', params);
  }





  private getMethod(method: string, params) {
    if (!this.token) {
      alert('You dont have a token.');
      return;
    }
    params.access_token = this.token;
    params.v = this.versionApi;

    return this.http.get(`${this.url}/method/${method}?`, { params })
      .pipe(
        catchError(() => of([]))
      );
  }

  getToken(): Observable<string> {
    const params = {
      client_id: this.clientId,
      display: 'page',
      redirect_uri: 'http://localhost:4200',
      response_type: 'token',
      v: this.versionApi
    };
    return of('http://oauth.vk.com/authorize?' + queryString.stringify(params));
  }

  getBadWords(): Observable<string[]> {
    return this.http.get<string[]>('./assets/bad-words.json');
  }

  getGoodWords(): Observable<string[]> {
    return this.http.get<string[]>('./assets/good-words.json');
  }
}
