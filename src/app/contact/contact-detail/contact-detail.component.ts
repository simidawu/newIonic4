
import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/service/contact.service';
import { PluginService } from '../../core/services/plugin.service';
import { DatabaseService } from 'src/app/shared/service/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sg-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {
  personData: any;
  needupdate = false;
  constructor(
    private route: ActivatedRoute,
    public contactService: ContactService,
    private dataBaseService: DatabaseService,
    private plugin: PluginService,
  ) { }

  async ngOnInit() {
    this.route.queryParams.subscribe((p) => {
      this.personData = JSON.parse(p.data);
    });
    /*ADD START 点击名片的时候从服务器刷新头像*/
    let avatar: string;
    const res = await this.contactService.getUserAvatar(
      this.personData.USER_NAME,
    );
    // console.log(res);
    // console.log(JSON.parse(res['_body']));
    const fromUserServeObj = JSON.parse(res['_body']);
    if (fromUserServeObj) {
      if (fromUserServeObj.AVATAR_URL.substr(0, 6) === 'assets') {
        avatar = fromUserServeObj.AVATAR_URL;
      } else {
        avatar = environment.baseUrl + fromUserServeObj.AVATAR_URL;
      }
      if (this.personData.AVATAR_URL !== avatar) {
        this.personData.AVATAR_URL = avatar;
        this.needupdate = true;
      }
      if (this.plugin.isCordova()) {
        await this.dataBaseService.updateAvatarByUsername(
          this.personData.USER_NAME,
          avatar,
        );
      }
    }
    /*ADD END*/
  }

  ionViewWillLeave() {
    this.contactService.writeViewHistory(this.personData);
    const types = this.contactService.getHaveSavedType();
    if (this.needupdate && types && types.length > 0) {
      types.forEach((type: string) => {
        const listDetail = this.contactService.getLocalStorage(type);
        if (listDetail && listDetail.list instanceof Array) {
          listDetail.list = listDetail.list.map((l: any) => {
            if (l.USER_NAME === this.personData.USER_NAME) {
              return this.personData;
            } else {
              return l;
            }
          });
          this.contactService.setLocalStorage(type, listDetail);
        }
      });
    }
  }
}
