import { environment } from '../../../../environments/environment';
// import { Layer } from 'task-layer';
import {
  User_Update_module,
  User_Update_modules,
} from './../../../shared/actions/user.action';
import { UserState, MyModule } from './../../../shared/models/user.model';
import { PluginService } from './../../../core/services/plugin.service';
import { MyStore } from './../../../shared/store';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { MyHttpService } from '../../../core/services/myHttp.service';
import { ApplicationConfig } from '../config/application.config';

@Injectable()
export class ApplicationService {
  moduleLists: MyModule[];
  // private layer: Layer = new Layer();

  constructor(
    private myHttp: MyHttpService,
    private store$: Store<MyStore>,
    private plugin: PluginService,
  ) {
    this.plugin.ObserveUser().subscribe((user: UserState) => {
      this.moduleLists = user.modules || [];
    });
    // this.layer
    //   .getInformer()
    //   .deal((data: ModuleTip) => this.toUpdateModuleTip(data));
  }

  // getLayer() {
  //   return this.layer;
  // }

  toUpdateModuleTip(data: ModuleTip) {
    let ls = this.moduleLists.find(m => m.MODULE_ID === data.MODULE_ID);
    if (ls) {
      ls.TIPS = data.TIPS;
      this.store$.dispatch(new User_Update_module(ls));
    }
  }

  observeModulesY() {
    return this.store$
      .select('userReducer').pipe(
        map((user: UserState) => user.modules || []),
        map(modues => modues.filter(m => m.DISPLAY === 'Y'))
      );

  }

  observeModulesN() {
    return this.store$
      .select('userReducer').pipe(
        map((user: UserState) => user.modules || []),
        map(modues => modues.filter(m => m.DISPLAY === 'N'))
      );
  }

  public moveAppToMorePage(moduleID: any) {
    return this.myHttp.post(
      ApplicationConfig.updateModuleDisplayUrl +
      `?moduleID=${moduleID}&display=N`,
      {},
    );
  }

  public moveItemToAppPage(moduleID: any) {
    return this.myHttp.post(
      ApplicationConfig.updateModuleDisplayUrl +
      `?moduleID=${moduleID}&display=Y`,
      {},
    );
  }

  getAllTips() {
    let empno = this.plugin.user.empno;
    let company_name = environment.companyID;
    let moduleId = this.moduleLists.map(m => m.MODULE_ID);
    let send = {
      empno,
      company_name,
      moduleId,
    };
    this.myHttp
      .post(ApplicationConfig.getAllTipsUrl, send)
      .then(a => {
        let tips = a.json();
        this.store$.dispatch(new User_Update_modules(tips));
      })
      .catch(err => console.log(err));
  }

   // 获取权限
   getPrivilege(moduleId: number) {
    return this.myHttp.get(
      environment.baseUrl + 'Guid/GetUserFunctions' + `?moduleID=${moduleId}`,
    );
  }
}

export class ModuleTip {
  MODULE_ID: number;
  TIPS: number;
  constructor(m: number, t: number) {
    this.MODULE_ID = m;
    this.TIPS = t;
  }
}
