import { Injectable } from '@angular/core';
import { MyHttpService } from '../../../core/services/myHttp.service';
import { MeConfig } from '../config/me.config';
import { PluginService } from '../../../core/services/plugin.service';
import { DatabaseService } from 'src/app/shared/service/database.service';

@Injectable()
export class MeService {
  constructor(
    private myHttp: MyHttpService,
    private databaseService: DatabaseService,
    private pluginService: PluginService,
  ) {}

  setAvatar(avatarUrl: string) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    try {
      return this.myHttp.post(MeConfig.updateAvatarUrl, {
        USER_NAME: user.username,
        PICTURE: avatarUrl,
      });
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  setLocalAvatar(username: string, avatar: string) {
    return this.databaseService.updateAvatarByUsername(username, avatar);
  }

  changeMobile(mobile: string) {
    try {
      return this.myHttp.post(MeConfig.updateUserInfoUrl, { MOBILE: mobile });
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  changeTele(tele: string) {
    try {
      return this.myHttp.post(MeConfig.updateUserInfoUrl, { TELEPHONE: tele });
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  changeMail(mail: string) {
    try {
      return this.myHttp.post(MeConfig.updateUserInfoUrl, { EMAIL: mail });
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }

  getUserInfo(username: string, site: string) {
    try {
      return this.myHttp.get(
        MeConfig.getUserInfoUrl + '?emp_name=' + username + '&site=' + site,
      );
    } catch (err) {
      this.pluginService.errorDeal(err);
    }
  }
}
