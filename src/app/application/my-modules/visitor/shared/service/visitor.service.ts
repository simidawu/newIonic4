import { Config } from '../config/config';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { MyHttpService } from '../../../../../core/services/myHttp.service';
import { tify, sify } from '../../../../../shared/utils/chinese-conv/';
import { environment } from '../../../../../../environments/environment';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
@Injectable()
export class VisitorService {
  constructor(private http: Http, private myHttp: MyHttpService) { }


  // 獲取今天日期
  getToday() {
    let rightDate: Date;
    const now: any = new Date();
    const yesterday = new Date((now / 1000 - 86400) * 1000);
    const hour = now.getHours();
    if (hour >= 8) {
      rightDate = now;
    } else {
      rightDate = yesterday;
    }
    const month =
      rightDate.getMonth() + 1 > 9
        ? rightDate.getMonth() + 1
        : '0' + (rightDate.getMonth() + 1);
    const day =
      rightDate.getDate() > 9 ? rightDate.getDate() : '0' + rightDate.getDate();
    return rightDate.getFullYear() + '-' + month + '-' + day;
  }


  // 獲取當月第一天
  getFirstDay() {
    const date = new Date();
    date.setDate(1);
    const dateStart = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    return dateStart;
    // return moment(new Date().setDate(1)).format('YYYY-MM-DD');
  }


  // 獲取當月最後一天
  getLastDay() {
    const date = new Date();
    let currentMonth = date.getMonth();
    const nextMonth = ++currentMonth;
    const nextMonthFirstDay: any = new Date(date.getFullYear(), nextMonth, 1);
    const oneDay = 1000 * 60 * 60 * 24;
    const newdate = new Date(nextMonthFirstDay - oneDay);
    const dateEnd = newdate.getFullYear() + '-' + (newdate.getMonth() + 1) + '-' + newdate.getDate();
    return dateEnd;
    // moment(new Date(new Date().getFullYear(), new Date().getMonth()+1,0)).format('YYYY-MM-DD');
  }


  // 獲取申請單據列表
  getApplyList(data: any) {
    return this.myHttp.get(
      Config.getApplyDataUrl
      + '?userid=' + data.userid
      + '&docno=' + data.docno
      + '&apply_empno=' + data.apply_empno
      + '&s_apply_date=' + data.s_apply_date
      + '&e_apply_date=' + data.e_apply_date
      + '&s_create_date=' + data.s_create_date
      + '&e_create_date=' + data.e_create_date
      + '&status=' + data.status
      + '&phone=' + data.phone
      + '&check=' + data.check ,
    );
  }


  // 根據ID獲取員工信息
  getEmployee(id: string) {
    return this.myHttp
      .get(Config.getEmployeeUrl +
        'id=' +
        id)
      .then(res => {
        const data = res.json();
        return Promise.resolve(data);
      })
  }


  // 獲取代理人
  getAgent(name: string) {
    if (!(typeof name === 'string')) {
      // return Observable.of([]);
      return of<any>([]);
    }
    let emp_name = tify(name.toUpperCase()).replace(/^\"/g, '').replace(/\"$/g, '');
    return this.http.get(Config.getAllAgentUrl + `emp_name=${emp_name}`).pipe(
      map(res => {
        console.log(res);
        return res;
      }),
    );
  }


  // 獲取部門
  getDepts(name: string) {
    if (!(typeof name === 'string')) {
      // return Observable.of([]);
      return of<any>([]);
    }
    let dept_infor = tify(name.toUpperCase()).replace(/^\"/g, '').replace(/\"$/g, '');
    return this.http.get(Config.getAllDeptUrl + `dept_infor=${dept_infor}`).pipe(
      map(res => {
        console.log(res);
        return res;
      }),
    );
    // return Observable.fromPromise(
    //   this.myHttp.get(Config.getAllDeptUrl + `dept_infor=${dept_infor}`),
    // ).map(r => {
    //   return r.json();
    // });
  }


  // 獲取部門信息
  getAllDepts(name: string) {
    if (!(typeof name === 'string')) {
      return false;
    }
    let dept_infor = tify(name.toUpperCase()).replace(/^\"/g, '').replace(/\"$/g, '');
    return this.myHttp.get(Config.getAllDeptUrl + `dept_infor=${dept_infor}`).then(r => {
      return r.json();
    });
  }


  // 獲取區域
  getArea(type: string, id?: string, tag?: string) {
    return this.myHttp.get(
      Config.getVisitAreaUrl
      + '?type=' + type
      + '&id=' + id
      + '&tag=' + tag
    );
  }


  // 修改區域負責人
  postAreadirector(data: any) {
    return this.myHttp.post(Config.getVisitAreaUrl, data).then(r => {
      console.log(r.json());
      return r.json();
    });
    // return Observable.fromPromise(
    //   this.myHttp.post(Config.getVisitAreaUrl, data),
    // ).map(r => {
    //   return r.json();
    // });
  }


  // 獲取所有預約施工物品分類
  async getLookUpType(lookupType: string) {
    return this.myHttp.get(
      Config.getToolSetting + `?lookup_type=${lookupType}`,
    );
  }


  // 獲取預設施工物品列表
  getGoodsList(type: string) {
    return this.myHttp.get(
      Config.getGoodsListUrl +
      '?type=' +
      type ,
    );
  }


  // 新增或修改物品
  postGoodsList(data: any) {
    return this.myHttp.post(Config.getGoodsListUrl, data).then(r => {
      console.log(r.json());
      return r.json();
    });
    // return Observable.fromPromise(
    //   this.myHttp.post(Config.getGoodsListUrl, data),
    // ).map(r => {
    //   return r.json();
    // });
  }


  // 單據提交申請
  async postApplyData(data: any) {
    let res;
    try {
      res = await this.myHttp.post(Config.ApplyDataUrl, data);
      return {
        content: res.json(),
        status: true,
      };
    } catch (e) {
      return {
        status: false,
      };
    }
  }


  // 删除單據
  async delete(id: any) {
    let res;
    res = await this.myHttp.delete(Config.ApplyDataUrl +
      '?id=' +
      id);
    return res.json();
  }


  // 删除來訪人員信息
  async delVisitor(id: any) {
    let res;
    res = await this.myHttp.delete(Config.deleteVisitorUrl +
      '?id=' +
      id);
    return res.json();
  }


  // 刪除訪客物品信息
  async delGood(id: any) {
    let res;
    res = await this.myHttp.delete(Config.deleteGoodUrl +
      '?id=' +
      id);
    return res.json();
  }


  // 單據送簽
  async sendSignData(sendData: any) {
    let saveRes: any = '';
    try {
      saveRes = await this.myHttp.post(environment.baseUrl + 'Attendance/SendSign', sendData);
      return {
        content: saveRes.json(),
        status: true,
      };
    } catch (e) {
      return {
        status: false,
      };
    }
  }


  // 取消送簽
  async CancelSignData(sendData: any) {
    try {
      await this.myHttp.post(environment.baseUrl + 'Attendance/CancelSign', sendData);
      return Promise.resolve('ok');
    } catch (e) {
      console.log(e);
      return Promise.resolve('');
    }
  }


  // 外部訪客掃描申請
  async sendApplyList(data: any) {
    try {
      await this.myHttp.post(Config.IORecordsUrl, data);
      return true;
    } catch (e) {
      return false;
    }
  }


  // 獲取訪客申請出入記錄
  getVisitApplyList() {
    return this.myHttp.get(Config.IORecordsUrl);
  }


  // 大門大樓今日預約列表
  getTodayCheckList() {
    return this.myHttp.get(Config.getTodayCheckListUrl);
  }


  // 門衛放行
  async postCheckData(data: any) {
    try {
      await this.myHttp.post(Config.postCheckDataUrl, data);
      return true;
    } catch (e) {
      return e;
    }
  }


  // 根據id獲取單據當日放行記錄
  getTodayHistory(id: number) {
    return this.myHttp.get(Config.getTodayHistoryUrl + '?id=' + id);
  }


  // 進出記錄是否相同
  isSameHistory(id: number) {
    return this.myHttp.get(Config.getisSameHistoryUrl + '?id=' + id);
  }


  // 單據終結
  async updateFormStatus(data: any) {
    try {
      await this.myHttp.post(Config.updateFormStatusUrl, data);
      return true;
    } catch (e) {
      return e;
    }
  }

}

