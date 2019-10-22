import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params,ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PluginService } from '../../../core/services/plugin.service';
// import { InspectionCommonService } from '../inspection/shared/service/inspectionCommon.service';
import { User_Update_Privilege } from './../../../shared/actions/user.action';
import { MyStore } from './../../../shared/store';
import { Store } from '@ngrx/store';


@Component({
  selector: 'sg-visitor',
  templateUrl: 'visitor.component.html',
  styleUrls: ['./visitor.component.scss'],
})
export class VisitorComponent implements OnInit {

  AdminParams: any = {
    role: 'COMMON'
  };

  moduleID: any;

  constructor(
    private activateInfo: ActivatedRoute,
    private router: Router,
    private plugin: PluginService,
    private $store: Store<MyStore>,
    // private inspectionCommonService: InspectionCommonService,
  ) {
    // activateInfo.queryParams.subscribe(queryParams => {
    //   this.moduleID = queryParams.id;
    // });
    this.activateInfo.paramMap.pipe(
      switchMap((params: ParamMap) =>
      this.moduleID = params.get('id'))
    );
  }

  privilegeList: {
    FUNCTION_ID: string;
    FUNCTION_NAME: string;
    FUNCTION_URL: string;
    ROLE_ID: number;
    ROLE_NAME: string;
  }[];

  security = false;
  common = false;
  set = false;
  admin = false;

  async ngOnInit() {
    // console.log('visit');
    console.log(this.moduleID);

    // let loading = this.plugin.createLoading();
    // loading.present();
    // let res: any = await this.inspectionCommonService
    //   .getPrivilege(moduleID)
    //   .catch(err => {
    //     this.plugin.errorDeal(err);
    //     return '';
    //   });
    // loading.dismiss();
    // if (!res) return;
    // this.privilegeList = res.json();
    // this.$store.dispatch(
    //   new User_Update_Privilege({
    //     moduleID: moduleID,
    //     function: this.privilegeList,
    //   }),
    // );
    // this.privilegeList.forEach(r => {
    //   if (r.ROLE_NAME == 'VISIT_ADMIN') {
    //     this.admin = true;

    //   } else if (r.ROLE_NAME == 'VISIT_SECURITY') {
    //     this.security = true;
    //   } else if (r.ROLE_NAME == 'VISIT_COMMON' || r.ROLE_NAME == 'VISIT_HR') {
    //     this.common = true;
    //   }
    // });
    // if (this.admin) {
    //   this.security = false;
    //   this.common = false;
    //   this.set = false;
    //   this.AdminParams = {
    //     role: 'ADMIN'
    //   };
    // } else if (this.security && this.common) {
    //   this.set = true;
    //   this.security = false;
    //   this.common = false;
    // }

  }
}
