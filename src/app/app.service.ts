import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private USER_GET_URL = 'https://api.vk.com/method/users.get?v=5.89&';

  constructor(private http: HttpClient) { }

  public getUserById(id: string): Observable<{}> {
    const params = {
      access_token: '1cf248f6e2de3ed7ee4939c0044b18db9966f5f35389fb2a84b0fa11b2b3b88dcd205b1c0e768c33544a0',
      user_ids: id,
      fields: 'photo_big',
    };
    const formattedParams = new URLSearchParams();
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        formattedParams.set(key, params[key]);
      }
    }
    return this.http.jsonp(this.USER_GET_URL + formattedParams, 'callback').pipe(
      map(res => {
        return res;
      })
    );
  }
}
