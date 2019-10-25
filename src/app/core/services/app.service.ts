import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tify } from '../../shared/utils/chinese-conv';
import { environment } from '../../../environments/environment';

import { Observable, of, from } from 'rxjs';
import { MyHttpService } from './myHttp.service';

@Injectable()
export class AppService {
  constructor(
    private http: HttpClient,
    private myHttp: MyHttpService,
  ) { }

  // 获得代理人
  getColleague(name: string): Observable<any> {
    if (!(typeof name === 'string')) {
      return of<any>([]);
    }
    const emp_name = tify(name.toUpperCase()).replace(/^\"/g, '').replace(/\"$/g, '');
    return from(this.myHttp.get(environment.baseUrl + `Guid/GetUserLikeNoSite?emp_name=${emp_name}`));
  }
}
