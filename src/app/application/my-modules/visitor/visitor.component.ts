import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PluginService } from '../../../core/services/plugin.service';
// import { InspectionCommonService } from '../inspection/shared/service/inspectionCommon.service';
import { User_Update_Privilege } from './../../../shared/actions/user.action';
import { MyStore } from './../../../shared/store';
import { Store } from '@ngrx/store';
import { LoadingController } from '@ionic/angular';
import { ApplicationService } from '../../shared/service/application.service';


@Component({
  selector: 'sg-visitor',
  templateUrl: 'visitor.component.html',
  styleUrls: ['./visitor.component.scss'],
})
export class VisitorComponent implements OnInit {


  constructor(
    private activateInfo: ActivatedRoute,
    private router: Router,
    private plugin: PluginService,
    private $store: Store<MyStore>,
    private loadingCtrl: LoadingController,
    private app: ApplicationService,
  ) {
  }

  privilegeList: {
    FUNCTION_ID: string;
    FUNCTION_NAME: string;
    FUNCTION_URL: string;
    ROLE_ID: number;
    ROLE_NAME: string;
  }[];

  ready = false;
  security = false;
  common = false;
  set = false;
  admin = false;

  async ngOnInit() {
    localStorage.setItem('visitorrole', 'VISIT_COMMON');
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loading.present();
    await this.app.getPrivilege(26273)
      .then(r => {
        this.privilegeList = r.json();
      })
      .catch(err => {
        this.plugin.errorDeal(err);
        return '';
      });
    loading.dismiss();
    this.privilegeList.forEach(r => {
      if (r.ROLE_NAME === 'VISIT_ADMIN') {
        localStorage.setItem('visitorrole', 'VISIT_ADMIN');
        this.admin = true;
      } else if (r.ROLE_NAME === 'VISIT_SECURITY') {
        this.security = true;
      } else if (r.ROLE_NAME === 'VISIT_COMMON' || r.ROLE_NAME === 'VISIT_HR') {
        this.common = true;
      }
    });
    if (this.admin) {
      this.security = false;
      this.common = false;
      this.set = false;
    } else if (this.security && this.common) {
      this.set = true;
      this.security = false;
      this.common = false;
    }
    this.ready = true;
  }
}
