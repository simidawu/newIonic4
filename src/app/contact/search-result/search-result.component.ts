import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../shared/service/contact.service';
import { CommonService } from 'src/app/core/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { ContactConfig } from '../shared/config/contact.config';

@Component({
  selector: 'sg-search-results',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {

  type = '';
  translateTexts: any = {};
  personList: any[] = [];         // 记录服务器返回的结果
  personListBackup: any[];        // 备份初始结果，当searchbar清空后恢复原来的数据
  typeDesc: string;               // 类型的中文描述

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public contactService: ContactService,
    public commonService: CommonService,
    public translate: TranslateService,
  ) { }


  async ngOnInit() {
    this.route.queryParams.subscribe((p) => {
      this.type = p.type;
    });

    this.translate
      .get([
        'Contact.sameDept',
        'Contact.subordinated',
        'Contact.all',
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });

    if (this.type === 'sameDept') {
      this.typeDesc = this.translateTexts['Contact.sameDept'];
    } else if (this.type === 'subordinated') {
      this.typeDesc = this.translateTexts['Contact.subordinated'];
    } else if (this.type === 'all') {
      this.typeDesc = this.translateTexts['Contact.all'];
    }

    const nowTime = new Date().getTime();

    let localList = {
      time: 0,
      list: []
    };
    localList = await this.contactService.getLocalStorage(this.type);

    if (localList) {
      // localstorage有效期一天，超过一天才再获取
      if (nowTime - localList.time > 86400000) {
        this.contactService.removeLocalStorage(this.type);
        this.getPersons();
      } else {
        this.personList = localList.list;
        this.personListBackup = localList.list;
      }
    } else {
      this.getPersons();
    }
  }


  async getPersons() {
    this.commonService.showLoading();
    let originRes: any;
    if (this.type === 'sameDept') {
      originRes = await this.contactService.getSameDeptPerson();
    } else if (this.type === 'subordinated') {
      originRes = await this.contactService.getSubordinate();
    } else if (this.type === 'all') {
      originRes = await this.contactService.getAllPersonByPage(environment.companyID, 1, ContactConfig.pageSize);
    }
    this.formatAndSaveData(originRes.json());
  }


  formatAndSaveData(obj: any[]) {
    for (let i = 0; i < obj.length; i++) {
      const avatar = obj[i].AVATAR_URL.substr(0, 6);
      if (avatar === 'Images') {
        obj[i].AVATAR_URL = environment.baseUrl + obj[i].AVATAR_URL;
      }
    }
    this.personList = obj;
    this.personListBackup = this.personList;
    this.commonService.hideLoading();
    this.contactService.setLocalStorage(this.type, {
      time: new Date().getTime(),
      list: this.personList,
    });
  }


  goToDetailPage(event: any) {
    this.router.navigate(['/tabs/contact/detail'], {
      queryParams: { data: event }
    });
    this.contactService.writeViewHistory(event);
  }
}
