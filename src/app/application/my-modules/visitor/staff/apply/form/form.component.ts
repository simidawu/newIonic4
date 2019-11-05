import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ModalController, PopoverController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { Subject, of } from 'rxjs';
import { timeout, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

import { MyValidatorModel } from '../../../../../../shared/models/my-validator.model';
import { ValidateService } from '../../../../../../core/services/validate.service';

import { VisitorService } from './../../../shared/service/visitor.service';
import { ApplyFormState } from '../../../shared/models/applyform.model ';
import { VFormMenuComponent } from '../../common/vform-menu/vform-menu.component';
import { AddEmployeesComponent } from '../../common/add-employees/add-employees.component';
import { AddVisitorsComponent } from '../../common/add-visitors/add-visitors.component';
import { AddGoodsComponent } from '../../common/add-goods/add-goods.component';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  value = '';
  error = false;

  name = '选择';
  values = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    private visitorService: VisitorService,
    private translate: TranslateService,
    private validateService: ValidateService,
  ) { }

  applyList: ApplyFormState;
  applyForm: FormGroup;
  myValidators: {};
  MyValidatorControl: MyValidatorModel;
  translateTexts: any = {};
  formData: any = {};

  fid = 0;  // 單據id
  title = ''; // 單據標題
  type = '';  // 單據類型
  status = '';  // 單據狀態

  scanType = '';  // 外部訪客掃碼類型
  isVisitor = false;  // 是否外部訪客
  isSending = false; // 是否送簽中

  user = []; //  當前登錄用戶

  cantEdit = false; // 字段是否允許修改
  outcantEdit = true; // 字段是否允許外部訪客修改

  DeptNo = ''; // 費用部門id
  specarealist: any[]; // 特殊門禁
  arealist: any[]; // 到訪區域
  visitorsdata: any = ''; // 存放來訪人員數據
  goodsdata: any = []; // 存放物品登記數據
  toolTypeList: any = []; // 施工物品分類

  // 頁面錯誤提醒
  errTip = '';
  timeError = '';
  MobileError = '';
  acesstelError = '';
  overInTelError = '';
  overOutTelError = '';
  chargeTelError = '';

  async ngOnInit() {
    this.subscribeTranslateText();
    this.route.queryParams.subscribe((p) => {
      console.log(p);
      if (p.id === undefined) {
        // 新增單據
        this.type = p.type === undefined ? '' : p.type;
      } else {
        this.fid = p.id === undefined ? '' : p.id;
        this.scanType = p.scanType === undefined ? '' : p.scanType;
        this.isVisitor = p.isVisitor === undefined ? false : p.isVisitor;

      }
    });
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    // 獲取所有區域
    const list: any = await this.visitorService.getArea(this.type);
    this.specarealist = list.filter(value => value.MACHINE_ID);
    this.arealist = list.filter(value => !value.MACHINE_ID);
    if (this.fid > 0) {
      const res = await this.visitorService.getApplyData(this.fid);
      console.log(res);
      this.formData = res[0];
      // this.type = this.formData.TYPE;
      this.status = this.formData.STATUS;
      this.applyList = this.formData;
      this.applyList.toolTypeSelect = '';

      if (this.formData.FREE_MEAL === 'Y') {
        this.applyList.FREE_MEAL = true;
      } else {
        this.applyList.FREE_MEAL = false;
      }

      if (this.formData.NETWORK === 'Y') {
        this.applyList.NETWORK = true;
      } else {
        this.applyList.NETWORK = false;
      }

      if (this.formData.APPLY_DATE !== '') {
        this.applyList.CREATION_DATE = this.formData.APPLY_DATE;
      }

      if (!this.isVisitor) {
        if (this.status === 'WAITING' || this.status === 'APPROVED') {
          this.cantEdit = true;
        }
      } else {
        this.cantEdit = true;
        this.outcantEdit = false;
      }

      if (this.formData.PROCESS_FLAG === 1) {
        this.isSending = true;
      }

      this.DeptNo = this.formData.CHARGE_DEPTNO;

      if (this.formData.AREA_IDS !== '') {
        let dataArr1: any[] = [];
        const areaArr = this.formData.AREA_IDS.split(",");

        this.specarealist.forEach(value => {
          if (areaArr.includes(value.ID + "")) {
            dataArr1.push(value.ID);
          }
        });
        this.applyList.specArea = dataArr1 === undefined ? [] : dataArr1;

        let dataArr2: any[] = [];
        this.arealist.forEach(value => {
          if (areaArr.includes(value.ID + "")) {
            dataArr2.push(value.ID);
          }
        });
        this.applyList.visitArea = dataArr2 === undefined ? [] : dataArr2;
      } else {
        this.applyList.specArea = [];
        this.applyList.visitArea = [];
      }

      this.visitorsdata = this.formData.visitorsdata;

      let vdata = [];
      for (let i = 0; i <= this.visitorsdata.length - 1; i++) {
        vdata.push(this.visitorsdata[i].PERSON_NAME);
      }
      this.applyList.visitors = vdata.join(',');

      this.goodsdata = this.formData.goodsdata;

      let gdata = [];
      for (let i = 0; i <= this.goodsdata.length - 1; i++) {
        this.goodsdata[i].GOODS_BRAND = this.goodsdata[i].GOODS_BRAND == null ? '' : this.goodsdata[i].GOODS_BRAND;
        this.goodsdata[i].GOODS_MODEL = this.goodsdata[i].GOODS_MODEL == null ? '' : this.goodsdata[i].GOODS_MODEL;
        let newone = this.goodsdata[i].GOODS_BRAND + this.goodsdata[i].GOODS_MODEL + this.goodsdata[i].GOODS_NAME + this.goodsdata[i].GOODS_QUANTITY + this.goodsdata[i].GOODS_UNIT;
        gdata.push(newone);
      }
      this.applyList.goodsList = gdata.join(',');
    } else {
      // 新增單據
      this.applyList = {
        ID: 0,
        DOCNO: '',
        APPLY_NAME: '',
        APPLY_TEL: '',
        APPLY_MOBILE: '',
        CREATION_DATE: '',
        CHARGE_DEPTNAME: '',
        ACESS_COMPANY_NAME: '',
        START_DATE: '',
        END_DATE: '',
        ACESS_REASON: '',
        specArea: [],
        FREE_MEAL: false,
        NETWORK: false,
        visitArea: [],
        ACESS_TEL: '',
        visitors: '',
        goodsList: '',
        REMARK: '',
        OVERSEER_IN: '',
        OVERSEER_INTEL: '',
        OVERSEER_OUT: '',
        OVERSEER_OUTTEL: '',
        CHARGE: '',
        CHARGE_TEL: '',
        toolTypeSelect: ''
      };
    }

    // 初始化
    this.init(this.applyList);
    this.MyValidatorControl = this.initValidator(this.applyList);
    this.myValidators = this.MyValidatorControl.validators;
    if (this.type === 'vip') {
      this.title = this.translateTexts['Visitor.application.type1'];
    } else if (this.type === 'ctm') {
      this.title = this.translateTexts['Visitor.application.type2'];
    } else if (this.type === 'emp') {
      this.applyList.FREE_MEAL = true;
      this.title = this.translateTexts['Visitor.application.type3'];
    } else if (this.type === 'visit') {
      this.title = this.translateTexts['Visitor.application.type4'];
    } else if (this.type === 'build') {
      const data = await this.visitorService.getLookUpType(
        'GOODS_TYPE',
      );
      this.toolTypeList = data.json();
      this.title = this.translateTexts['Visitor.application.type5'];
    } else {
      this.title = this.translateTexts['Visitor.module.tab_apply'];
    }
    if (this.type === 'vip' || this.type === 'ctm' || this.type === 'emp') {
      this.applyList.NETWORK = true;
    }

  }

  subscribeTranslateText() {
    this.translate
      .get([
        'Visitor.application.type1',
        'Visitor.application.type2',
        'Visitor.application.type3',
        'Visitor.application.type4',
        'Visitor.application.type5',
        'Visitor.module.tab_apply',
        'Visitor.error.applicant_required_err',
        'Visitor.error.applyPhone_required_err',
        'Visitor.error.constDept_required_err',
        'Visitor.error.visitCompany_required_err',
        'Visitor.error.startTime_required_err',
        'Visitor.error.endTime_required_err',
        'Visitor.error.time_err',
        'Visitor.error.time_err1',
        'Visitor.error.time_err2',
        'Visitor.error.time_err3',
        'Visitor.error.time_err4',
        'Visitor.error.time_err5',
        'Visitor.error.time_err6',
        'Visitor.error.visitReason_required_err',
        'Visitor.error.visitArea_required_err',
        'Visitor.error.visitorPhone_required_err',
        'Visitor.error.visitors_required_err',
        'Visitor.error.inOverseer_required_err',
        'Visitor.error.inOverseerPhone_required_err',
        'Visitor.error.outOverseer_required_err',
        'Visitor.error.outOverseerPhone_required_err',
        'Visitor.error.workHeader_required_err',
        'Visitor.error.workHeaderPhone_required_err',
        'Visitor.application.addvisitor',
        'Visitor.application.editvisitor',
        'Visitor.application.addgoods',
        'Visitor.application.editgoods',
        'Visitor.application.apply_success',
        'Visitor.application.apply_failed',
        'cancel',
        'confirm',
        'delete',
        'delete_alert',
        'delete_succ',
        'delete_fail',
        'save_succ',
        'send_succ',
        'Visitor.application.no_signlist',
        'Visitor.error.phone_error',
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
  }

  init(form: any = {}) {
    const fb = new FormBuilder();
    this.applyForm = fb.group({
      ID: [form.ID],
      DOCNO: [{ value: form.DOCNO, disabled: true }],
      APPLY_NAME: [{ value: form.APPLY_NAME, disabled: this.cantEdit }, [Validators.required]],
      APPLY_TEL: [{ value: form.APPLY_TEL, disabled: this.cantEdit }],
      APPLY_MOBILE: [{ value: form.APPLY_MOBILE, disabled: this.cantEdit }, [Validators.required]],
      CREATION_DATE: [{ value: form.CREATION_DATE, disabled: true }],
      CHARGE_DEPTNAME: [{ value: form.CHARGE_DEPTNAME, disabled: this.cantEdit },
      (this.type === 'vip' || this.type === 'ctm' || this.type === 'emp') && !this.isVisitor ? [Validators.required] : ''],
      ACESS_COMPANY_NAME: [{ value: form.ACESS_COMPANY_NAME, disabled: this.cantEdit }, [Validators.required]],
      START_DATE: [{ value: form.START_DATE, disabled: this.cantEdit }, [Validators.required]],
      END_DATE: [{ value: form.END_DATE, disabled: this.cantEdit }, [Validators.required]],
      ACESS_REASON: [{ value: form.ACESS_REASON, disabled: this.cantEdit }, [Validators.required]],
      specArea: [{ value: form.specArea, disabled: this.cantEdit }],
      FREE_MEAL: [{ value: form.FREE_MEAL, disabled: this.cantEdit }],
      NETWORK: [{ value: form.NETWORK, disabled: this.cantEdit }],
      visitArea: [{ value: form.visitArea, disabled: this.cantEdit }, !this.isVisitor ? [Validators.required] : ''],
      ACESS_TEL: [{ value: form.ACESS_TEL, disabled: this.cantEdit }, this.type === 'visit' ? [Validators.required] : ''],
      visitors: [form.visitors, [Validators.required]],
      goodsList: [form.goodsList],
      OVERSEER_IN: [{ value: form.OVERSEER_IN, disabled: this.cantEdit }, this.type === 'build' ? [Validators.required] : ''],
      OVERSEER_INTEL: [{ value: form.OVERSEER_INTEL, disabled: this.cantEdit }, this.type === 'build' ? [Validators.required] : ''],
      OVERSEER_OUT: [{ value: form.OVERSEER_OUT, disabled: this.cantEdit }, this.type === 'build' ? [Validators.required] : ''],
      OVERSEER_OUTTEL: [{ value: form.OVERSEER_OUTTEL, disabled: this.cantEdit }, this.type === 'build' ? [Validators.required] : ''],
      CHARGE: [{ value: form.CHARGE, disabled: this.cantEdit }, this.type === 'build' ? [Validators.required] : ''],
      CHARGE_TEL: [{ value: form.CHARGE_TEL, disabled: this.cantEdit }, this.type === 'build' ? [Validators.required] : ''],
      REMARK: [form.REMARK],
      toolTypeSelect: [form.toolTypeSelect],
    },
      { validator: this.status === '' || this.status === 'NEW' || this.status === 'CANCELED' ? [this.timeCheck.bind(this)] : '' },
    );
  }



  currentDateFormat(date: Date, format: string = 'yyyy-mm-dd HH:MM'): any {
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    if (date.toString() === '') {
      date = new Date();
    }
    return format
      .replace('yyyy', pad(date.getFullYear()))
      .replace('mm', pad(date.getMonth() + 1))
      .replace('dd', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('MM', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  onOk(result: Date) {
    this.name = this.currentDateFormat(result, 'yyyy-mm-dd');
    this.values = result;
  }

  formatIt(date: Date, form: string) {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    if (form === 'YYYY-MM-DD') {
      return dateStr;
    }
    if (form === 'HH:mm') {
      return timeStr;
    }
    return `${dateStr} ${timeStr}`;
  }

  timeCheck(control: FormGroup): any {
    const values = control.controls;
    if (values.START_DATE.value && values.END_DATE.value) {
      const startTime = values.START_DATE.value;
      const endTime = values.END_DATE.value;
      const t = 1000 * 60 * 60 * 24;
      const times = Date.parse(endTime) - Date.parse(startTime);
      const lasttime = Date.parse(startTime) - Date.parse(this.visitorService.getToday());
      const timeinterval = Math.ceil(times / t);  // 時間間隔
      this.timeError = times < 0 ? this.translateTexts['Visitor.error.time_err'] : '';  // 進場時間不能大於出廠時間
      if (lasttime < 0) {
        this.timeError = this.translateTexts['Visitor.error.time_err6'];    // 不能是過去的時間
      }
      if (this.type === 'vip' || this.type === 'ctm' || this.type === 'emp') {
        if (lasttime <= 0) {
          this.timeError = this.translateTexts['Visitor.error.time_err2'];    // 不能今天申請
        } else if (Date.parse(startTime) - 9 * t > Date.parse(this.visitorService.getToday())) {
          this.timeError = this.translateTexts['Visitor.add.time_err1'];    // 最多隻能提前8天
        }
      }
      if (this.type === 'vip' && timeinterval > 6) {
        this.timeError = this.translateTexts['Visitor.error.time_err3'];  // VIP證件有效期
      }
      if (this.type === 'ctm' && timeinterval > 89) {
        this.timeError = this.translateTexts['Visitor.error.time_err4'];  // 客戶證件有效期
      }
      if (this.type === 'visit' && timeinterval > 2) {
        this.timeError = this.translateTexts['Visitor.error.time_err5'];  // 訪客證件有效期
      }
    }
  }


  initValidator(bind: any) {
    const newValidator = new MyValidatorModel(
      [
        { name: 'ID', valiItems: [] },
        { name: 'DOCNO', valiItems: [] },
        {
          name: 'APPLY_NAME',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.applicant_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'APPLY_MOBILE',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.applyPhone_required_err'],
              valiValue: true,
            },
          ],
        },
        { name: 'APPLY_TEL', valiItems: [], },
        { name: 'CREATION_DATE', valiItems: [] },
        {
          name: 'CHARGE_DEPTNAME',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.constDept_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'ACESS_COMPANY_NAME',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.visitCompany_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'START_DATE',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.startTime_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'END_DATE',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.endTime_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'ACESS_REASON',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.visitReason_required_err'],
              valiValue: true,
            },
          ],
        },
        { name: 'specArea', valiItems: [] },
        { name: 'FREE_MEAL', valiItems: [] },
        { name: 'NETWORK', valiItems: [] },
        {
          name: 'visitArea',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.visitArea_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'ACESS_TEL',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.visitorPhone_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'visitors',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.visitors_required_err'],
              valiValue: true,
            },
          ],
        },
        { name: 'goodsList', valiItems: [] },
        {
          name: 'OVERSEER_IN',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.inOverseer_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'OVERSEER_INTEL',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.inOverseerPhone_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'OVERSEER_OUT',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.outOverseer_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'OVERSEER_OUTTEL',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.outOverseerPhone_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'CHARGE',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.workHeader_required_err'],
              valiValue: true,
            },
          ],
        },
        {
          name: 'CHARGE_TEL',
          valiItems: [
            {
              valiName: 'Required',
              errMessage: this.translateTexts['visit.add.workHeaderPhone_required_err'],
              valiValue: true,
            },
          ],
        },
        { name: 'REMARK', valiItems: [] },

      ],
      bind,
    );
    return newValidator;
  }

  async presentPopover(myEvent: any) {
    const popover = await this.popoverCtrl.create({
      component: VFormMenuComponent,
      componentProps: {
        this: this,
        data: this.applyList.DOCNO,
        type: 'apply'
      },
      event: myEvent,
    }
    );
    return await popover.present();
  }

  inputChange(e) {
    const value = e.replace(/\s/g, '');
    if (value.length < 11 && value.length > 0) {
      this.error = true;
    } else {
      this.error = false;
    }
    this.value = e;
  }

}
