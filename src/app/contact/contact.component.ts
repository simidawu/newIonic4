import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from './shared/service/contact.service';
import { of } from 'rxjs';
import { timeout, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CommonService } from '../core/services/common.service';
import { environment } from './../../environments/environment';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {

  contacter: any[] = [];
  searchFilter: string; // 记录搜索条件
  searchResult: any[] = []; // 保存通过searchbar搜索后返回的结果

  constructor(
    private router: Router,
    public contactService: ContactService,
    public commonService: CommonService,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.contacter = this.contactService.getLocalStorage('viewHistory');
  }

  clearFilter() {
    this.searchFilter = '';
    this.searchResult = [];
  }

  // 取得searchbar的值
  async getItems(event: any) {
    this.searchFilter = event.target.value;

    of(this.searchFilter).pipe(
      timeout(500),
      distinctUntilChanged(),
      switchMap(res => {
        if (res) {
          this.searchResult = [];
          let length = this.commonService.getByteLen(this.searchFilter);
          if (length >= 3) {
            return this.contactService.getPersonByNameNoSite(this.searchFilter);
          } else {
            return [];
          }
        } else {
          return [];
        }
      })
    ).subscribe(persons => {
      let obj: any[] = persons.json();
      for (let i = 0; i < obj.length; i++) {
        let avatar = obj[i].AVATAR_URL.substr(0, 6);
        if (avatar === 'Images') {
          obj[i].AVATAR_URL = environment.baseUrl + obj[i].AVATAR_URL;
        }
      }
      this.searchResult = obj;
    });
  }

  goToSearchDetail(type: string) {
    this.router.navigate(['/tabs/contact/search'], {
      queryParams: { type: type }
    });
  }

  goToDetailPage(event: any) {
    this.router.navigate(['/tabs/contact/detail'], {
      queryParams: { data: JSON.stringify(event) }
    });
    this.contactService.writeViewHistory(event);
  }

}
