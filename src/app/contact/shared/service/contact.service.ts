import { PluginService } from './../../../core/services/plugin.service';
import { Injectable } from '@angular/core';

import { MyHttpService } from '../../../core/services/myHttp.service';
// import { ContactConfig } from '../../config/contact.config';
import { ContactConfig } from '../../shared/config/contact.config';

@Injectable()
export class ContactService {
  username: string;
  name = 'allSavedContactType';
  constructor(
    private myHttp: MyHttpService,
    private pluginService: PluginService,
  ) {
    this.username = JSON.parse(localStorage.getItem('currentUser')).username;
  }

  public getOrg() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    try {
      return this.myHttp.get(
        ContactConfig.getOrgUrl + `?user_name=${user.username}`,
      );
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  public getSameDeptPerson() {
    try {
      return this.myHttp.get(ContactConfig.getSameDeptPersonUrl);
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  public getDeptInfo(site: string) {
    try {
      return this.myHttp.get(ContactConfig.getDeptInfoUrl + `?site=${site}`);
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  public getPersonByDept(site: string, deptno: string) {
    try {
      return this.myHttp.get(
        ContactConfig.getPersonByDeptUrl + `?site=${site}&deptno=${deptno}`,
      );
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  public getSubordinate() {
    try {
      return this.myHttp.get(ContactConfig.getSubordinateUrl);
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  public setLocalStorage(type: string, value: any) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const username = user.username;
    localStorage.setItem(
      username + '_' + 'contact_' + type,
      JSON.stringify(value),
    );
    this.updataHaveSavedType(true, type);
  }

  public getLocalStorage(type: string) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const username = user.username;
    return JSON.parse(localStorage.getItem(username + '_' + 'contact_' + type));
  }
  public removeLocalStorage(type: string) {
    this.updataHaveSavedType(false, type);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const username = user.username;
    return localStorage.removeItem(username + '_' + 'contact_' + type);
  }

  updataHaveSavedType(add: boolean, type: string) {
    const name = this.name;
    let data: string[] = this.getHaveSavedType();
    if (add) {
      if (data.indexOf(type) < 0) {
        data.push(type);
      }
    } else {
      data = data.filter((d: string) => d !== type);
    }
    localStorage.setItem(name, JSON.stringify(data));
  }

  getHaveSavedType() {
    const name = this.name;
    let data: any = localStorage.getItem(name);
    if (data) {
      data = JSON.parse(data);
    } else {
      data = [];
    }
    return data;
  }

  public getPersonByName(filter: string, site: string) {
    try {
      return this.myHttp.get(
        ContactConfig.getPersonByNameUrl + `?emp_name=${filter}&site=${site}`,
      );
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  public getPersonByNameNoSite(filter: string) {
    try {
      return this.myHttp.get(
        ContactConfig.getPersonByNameNoSiteUrl + `?emp_name=${filter}`,
      );
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  public getAllPersonByPage(site: string, pageIndex: number, pageSize: number) {
    try {
      return this.myHttp.get(
        ContactConfig.getAllPersonByPageUrl +
        `?site=${site}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      );
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  // 根据等级获取公司部门信息
  public getDeptInfoByGrade(site: string, grade: number) {
    try {
      return this.myHttp.get(
        ContactConfig.getDeptInfoByGradeUrl + `?site=${site}&grade=${grade}`,
      );
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  // 获取子部门信息
  public getChildDeptInfo(site: string, deptno: string) {
    try {
      return this.myHttp.get(
        ContactConfig.getChildDeptInfoUrl + `?site=${site}&deptno=${deptno}`,
      );
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  public writeViewHistory(personData: any) {
    const historyData: any[] = this.getLocalStorage('viewHistory')
      ? this.getLocalStorage('viewHistory')
      : [];
    const length = historyData.length;
    if (length <= 9) {
      historyData.forEach((value, index) => {
        if (value.USER_NAME === personData.USER_NAME) {
          historyData.splice(index, 1);
        }
      });
      historyData.splice(0, 0, personData);
      this.setLocalStorage('viewHistory', historyData);
    } else {
      historyData.forEach((value, index) => {
        if (value.USER_NAME === personData.USER_NAME) {
          historyData.splice(index, 1);
        }
      });
      historyData.splice(0, 0, personData);
      if (historyData.length > 10) {
        historyData.pop();
      }
      this.setLocalStorage('viewHistory', historyData);
    }
  }

  // 刷新指定用戶頭像
  getUserAvatar(username: string) {
    try {
      return this.myHttp.get(
        ContactConfig.getAvatarUrl + `?userName=${username}`,
      );
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }
}

const ORG = [
  {
    DEPTNO: 'MIC',
    DEPTNAME: '神達電腦',
  },
  {
    DEPTNO: 'MSL',
    DEPTNAME: '順達電腦',
  },
  {
    DEPTNO: 'MKL',
    DEPTNAME: '昆達電腦',
  },
];
