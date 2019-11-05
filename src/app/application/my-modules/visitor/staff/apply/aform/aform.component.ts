import {
  NavController,
  AlertController,
  ModalController,
  PopoverController,
  Events,
  LoadingController,
} from '@ionic/angular';
import { Observable, Subject, of } from 'rxjs';
import { timeout, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MyValidatorModel } from '../../../../../../shared/models/my-validator.model';
import { VisitorService } from './../../../shared/service/visitor.service';
import { ValidateService } from '../../../../../../core/services/validate.service';
import { PluginService } from '../../../../../../core/services/plugin.service';
import { VFormMenuComponent } from '../../common/vform-menu/vform-menu.component';
import { AddEmployeesComponent } from '../../common/add-employees/add-employees.component';
import { AddVisitorsComponent } from '../../common/add-visitors/add-visitors.component';
import { AddGoodsComponent } from '../../common/add-goods/add-goods.component';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'sg-aform',
  templateUrl: 'aform.component.html',
  styleUrls: ['./aform.component.scss'],
})
export class AformComponent implements OnInit {

  private searchTerms = new Subject<string>();
  private searchDept = new Subject<string>();

  applyForm: FormGroup;
  myValidators: {};
  MyValidatorControl: MyValidatorModel;
  translateTexts: any = {};
  formData: any = {};

  applyList: {
    ID: number,
    DOCNO: string,
    APPLY_NAME: string,
    APPLY_TEL: string,
    APPLY_MOBILE: string,
    CREATION_DATE: string,
    CHARGE_DEPTNAME: string,
    ACESS_COMPANY_NAME: string,
    START_DATE: string,
    END_DATE: string,
    ACESS_REASON: string,
    specArea: any[],
    FREE_MEAL: boolean,
    NETWORK: boolean,
    visitArea: any[],
    ACESS_TEL: string,
    visitors: string | any,
    goodsList: string | any,
    REMARK: string,
    OVERSEER_IN: string,
    OVERSEER_INTEL: string,
    OVERSEER_OUT: string,
    OVERSEER_OUTTEL: string,
    CHARGE: string,
    CHARGE_TEL: string,
    toolTypeSelect: string
  };

  title = ''; // 单据申请
  fid = 0;  // 單據id
  type = ''; // 单据类型
  status = ''; // 单据状态
  user = []; //  當前登錄用戶
  cantEdit = false; // 字段是否允许修改
  outcantEdit = true; // 字段是否允许外部访客修改

  isSelectcolleague = false; // 判断是否正确选择申请人
  tempcolleague = ''; // 临时作保存的中间申请人
  colleague: any; // api返回搜索申请人結果
  APPLY_EMPNO: ''; // 申请人工号
  APPLY_SITE: ''; // 申请人所属公司
  getTime = 0; // 手机号码发送验证请求延时

  isSelectDept = false; // 判断是否正确选择费用部门
  tempDept = ''; // 临时作保存的费用部门
  DeptList: any; // 搜索得到的费用部门
  DeptNo = ''; // 费用部门id

  specarealist: any[]; // 特殊门禁
  arealist: any[]; // 到访区域

  visitorsdata: any = ''; // 存放来访人员数据
  goodsdata: any = []; // 存放物品登记数据
  toolTypeList: any = []; // 施工物品分类


  isSending = false; // 是否送签中
  isVisitor = false; // 是否为外部访客

  scanType = ''; // 外部访客扫描二维码类型

  // 页面错误提示
  errTip = '';
  timeError = '';
  APPLY_MOBILE_Error = '';
  ACESS_TEL_Error = '';
  OVERSEER_INTEL_Error = '';
  OVERSEER_OUTTEL_Error = '';
  CHARGE_TEL_Error = '';

  constructor(
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private plugin: PluginService,
    private visitorService: VisitorService,
    private events: Events,
    private translate: TranslateService,
    private validateService: ValidateService,
  ) { }

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
      this.formData = res[0];
      console.log(this.formData);
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

      this.applyList.CREATION_DATE = moment(this.formData.CREATION_DATE).format('YYYY-MM-DD');

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
        let newone = this.goodsdata[i].GOODS_BRAND + this.goodsdata[i].GOODS_MODEL + this.goodsdata[i].GOODS_NAME
          + this.goodsdata[i].GOODS_QUANTITY + this.goodsdata[i].GOODS_UNIT;
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

  addSubcribe() {
    for (let prop in this.myValidators) {
      this.applyForm.controls[prop].valueChanges.subscribe((value: any) => {
        this.check(value, prop);
      });
    }

    let phoneCheck = ['APPLY_MOBILE', 'ACESS_TEL', 'OVERSEER_INTEL', 'OVERSEER_OUTTEL', 'CHARGE_TEL'];
    for (var i = 0; i < phoneCheck.length; i++) {
      let check = phoneCheck[i];
      this.applyForm.controls[check].valueChanges.subscribe(() => {
        this.getTime = new Date().getTime();
        let interval = setInterval(() => {
          if (new Date().getTime() - this.getTime >= 1000) {
            this.PhoneCheck(this.applyForm.controls[check], check);
            clearInterval(interval);
          }
        }, 200);
      });
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
      CHARGE_DEPTNAME: [{ value: form.CHARGE_DEPTNAME, disabled: this.cantEdit }, (this.type === 'vip' || this.type === 'ctm' || this.type === 'emp') && !this.isVisitor ? [Validators.required] : ''],
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


  timeCheck(control: FormGroup): any {
    const values = control.controls;
    if (values.START_DATE.value && values.END_DATE.value) {
      const startTime = values.START_DATE.value;
      const endTime = values.END_DATE.value;
      const t = 1000 * 60 * 60 * 24;
      const times = Date.parse(endTime) - Date.parse(startTime);
      const lasttime = Date.parse(startTime) - Date.parse(this.visitorService.getToday());
      const timeinterval = Math.ceil(times / t);  // 时间间隔
      this.timeError = times < 0 ? this.translateTexts['visit.add.time_err'] : '';  // 进厂时间不能大于出厂时间
      if (lasttime < 0) {
        this.timeError = this.translateTexts['visit.add.time_err6'];    // 不能是过去的时间
      }
      if (this.type === 'vip' || this.type === 'ctm' || this.type === 'emp') {
        if (lasttime <= 0) {
          this.timeError = this.translateTexts['visit.add.time_err2'];    // 不能今天申请
        } else if (Date.parse(startTime) - 9 * t > Date.parse(this.visitorService.getToday())) {
          this.timeError = this.translateTexts['visit.add.time_err1'];    // 最多只能提前8天
        }
      }
      if (this.type === 'vip' && timeinterval > 6) {
        this.timeError = this.translateTexts['visit.add.time_err3'];  // vip证件有效期
      }
      if (this.type === 'ctm' && timeinterval > 89) {
        this.timeError = this.translateTexts['visit.add.time_err4'];  // 客户证件有效期
      }
      if (this.type === 'visit' && timeinterval > 2) {
        this.timeError = this.translateTexts['visit.add.time_err5'];  // 访客证件有效期
      }
    }
  }

  PhoneCheck(control: AbstractControl, name: string): any {
    if (name === 'APPLY_MOBILE') {
      if (control.value !== '') {  // 申请人电话
        if (this.phonerole(control.value) === false) {
          this.APPLY_MOBILE_Error = this.translateTexts['meComponent.incorrectmobile'];
        } else {
          this.APPLY_MOBILE_Error = '';
        }
      } else {
        this.APPLY_MOBILE_Error = this.translateTexts['visit.add.applyPhone_required_err'];
      }
    }
    if (this.type !== 'build' && name === 'ACESS_TEL') {
      if (control.value !== '') {  // 被邀访客联系电话
        if (this.phonerole(control.value) === false) {
          this.ACESS_TEL_Error = this.translateTexts['meComponent.incorrectmobile'];
        } else {
          this.ACESS_TEL_Error = '';
        }
      } else {
        this.ACESS_TEL_Error = this.translateTexts['visit.add.visitorPhone_required_err'];
      }
    }

    if (this.type === 'build') {
      if (name === 'OVERSEER_INTEL') {
        if (control.value !== '') {  // 厂内现场监工电话
          if (this.phonerole(control.value) === false) {
            this.OVERSEER_INTEL_Error = this.translateTexts['meComponent.incorrectmobile'];
          } else {
            this.OVERSEER_INTEL_Error = '';
          }
        } else {
          this.OVERSEER_INTEL_Error = this.translateTexts['visit.add.inOverseerPhone_required_err'];
        }
      }

      if (name === 'OVERSEER_OUTTEL') {
        if (control.value !== '') {  // 厂外现场监工电话
          if (this.phonerole(control.value) === false) {
            this.OVERSEER_OUTTEL_Error = this.translateTexts['meComponent.incorrectmobile'];
          } else {
            this.OVERSEER_OUTTEL_Error = '';
          }
        } else {
          this.OVERSEER_OUTTEL_Error = this.translateTexts['visit.add.outOverseerPhone_required_err'];
        }
      }

      if (name === 'CHARGE_TEL') {
        if (control.value !== '') {  // 施工单位负责人电话
          if (this.phonerole(control.value) === false) {
            this.CHARGE_TEL_Error = this.translateTexts['meComponent.incorrectmobile'];
          } else {
            this.CHARGE_TEL_Error = '';
          }
        } else {
          this.CHARGE_TEL_Error = this.translateTexts['visit.add.workHeaderPhone_required_err'];
        }
      }

    }
  }

  phonerole(phone: any): any {
    let res: any =
      /^1[3|4|5|7|8][0-9]{9}$/.test(phone) ||
      /^([-_－—\s\(]?)([\(]?)((((0?)|((00)?))(((\s){0,2})|([-_－—\s]?)))|(([\)]?)[+]?))(886)?([\)]?)([-_－—\s]?)([\(]?)[0]?[1-9]{1}([-_－—\s\)]?)[1-9]{2}[-_－—]?[0-9]{3}[-_－—]?[0-9]{3}$/.test(
        phone
      );
    return res ? true : false;
  }


  // 單獨輸入塊驗證
  check(value: any, name: string): Promise<any> {
    this.myValidators[name].value = value;
    if (!this.myValidators[name].dataset) {
      return;
    }
    return this.validateService
      .check(this.myValidators[name], this.myValidators)
      .then(prams => {
        this.myValidators[name].error = prams.mes;
        this.myValidators[name].pass = !prams.mes;
        return Promise.resolve(this.myValidators);
      });
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

  // 搜索申请人
  searchapplicant(item: any) {

    // 判断是否正确选择申请人
    if (this.tempcolleague) {
      this.isSelectcolleague = item.value !== this.tempcolleague ? false : true;
    }
    this.searchTerms.next(item.value);
  }

  // 回填申请人和电话
  async getcolleague(item: any) {
    this.isSelectcolleague = true;
    this.searchTerms.next('');
    this.tempcolleague = item.NICK_NAME;
    this.applyForm.controls['APPLY_NAME'].setValue(this.tempcolleague);
    this.applyForm.controls['APPLY_MOBILE'].setValue(item.MOBILE);
    this.applyForm.controls['APPLY_TEL'].setValue(item.TELEPHONE);
    this.applyForm.controls['CHARGE_DEPTNAME'].setValue(item.DEPT_NAME);
    this.APPLY_EMPNO = item.EMPNO;
    this.APPLY_SITE = item.COMPANY_ID;
    this.DeptNo = item.DEPTNO;
  }

  searchdept(item: any) {
    // 判断是否正确选择费用部门
    if (this.tempDept) {
      this.isSelectDept = item.value !== this.tempDept ? false : true;
    }
    this.searchDept.next(item.value);
  }

  // 选取上级
  getdeptlist(name: string) {
    this.isSelectDept = true;
    this.tempDept = name;
    this.searchDept.next('');
    this.applyForm.controls['CHARGE_DEPTNAME'].setValue(name);
  }

  collatFormData() {
    // 获取表单所有数据
    this.formData.data = this.applyForm.value;

    this.formData.data.TYPE = this.type;
    if (this.formData.data.ID === '') {
      this.formData.data.STATUS = 'NEW';
    }
    this.formData.data.PROCESS_FLAG = 0;


    // 整合所选区域
    let AreaID: any;
    let Area: any = [];
    if (this.applyForm.value.specArea !== '') {
      AreaID = this.applyForm.value.specArea.concat(this.applyForm.value.visitArea);
      for (var i = 0; i < this.applyForm.value.specArea.length; i++) {
        this.specarealist.forEach((value) => {
          if (this.applyForm.value.specArea[i] === value.ID) {
            Area.push(value.AREA_NAME);
          }
        });
      }
    } else {
      AreaID = this.applyForm.value.visitArea;
    }

    this.formData.data.AREA_IDS = AreaID.join(',');
    for (var i = 0; i < this.applyForm.value.visitArea.length; i++) {
      this.arealist.forEach((value) => {
        if (this.applyForm.value.visitArea[i] === value.ID) {
          Area.push(value.AREA_NAME);
        }
      });
    }
    this.formData.data.AREA_NAME = Area.join(',');


    // 获取申请人信息
    this.formData.data.APPLY_EMPNO = this.APPLY_EMPNO;
    this.formData.data.APPLY_SITE = this.APPLY_SITE;
    this.formData.data.CHARGE_DEPTNO = this.DeptNo;


    // 转换判断
    if (this.formData.data.FREE_MEAL == true) {
      this.formData.data.FREE_MEAL = 'Y';
    } else {
      this.formData.data.FREE_MEAL = 'N';
    }
    if (this.formData.data.NETWORK == true) {
      this.formData.data.NETWORK = 'Y';
    } else {
      this.formData.data.NETWORK = 'N';
    }


    // 网络
    this.formData.data.NET_USER = '';
    this.formData.data.NET_PASSWORD = '';


    // 来访人员和携带物品
    this.formData.visitorsdata = this.visitorsdata;
    this.formData.goodsdata = this.goodsdata;

  }

  async saveForm() {
    this.collatFormData();
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.present();
    let rtn: any;
    try {
      let res: any;
      res = await this.visitorService.postApplyData(this.formData);
      if (res.content) {
        rtn = res.content;
        this.applyForm.controls['ID'].setValue(this.applyList.ID === 0 ? rtn['ID'] : this.applyList.ID);
        this.applyForm.controls['DOCNO'].setValue(this.applyList.DOCNO === '' ? rtn['DOCNO'] : this.applyList.DOCNO);
      }
      loading.dismiss();
      this.plugin.showToast(this.translateTexts['attendance.save_success']);
    } catch (err) {
      loading.dismiss();
      console.log(err);
      this.errTip = err;
    }

  }

  async sendForm() {
    this.collatFormData();
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.present();
    let rtn: any;
    try {
      let res: any;
      res = await this.visitorService.postApplyData(this.formData);
      if (res.content) {
        rtn = res.content;
        this.applyList.DOCNO = this.applyList.DOCNO === '' ? rtn['DOCNO'] : this.applyList.DOCNO;
      }
      if (rtn) {
        const sendData: any = {
          KIND: 'MHTVISIT',
          DOCNO: rtn['DOCNO'],
          EMPNO: this.APPLY_EMPNO
        };
        try {
          const res: any = await this.visitorService.sendSignData(sendData);
          this.isSending = true;
          console.log(res);
          loading.dismiss();
          this.plugin.showToast(this.translateTexts['attendance.submit_succ']);
          this.navCtrl.pop();
        } catch (e) {
          loading.dismiss();
          console.log(e);
          this.errTip = e;
        }
      } else {
        loading.dismiss();
        this.plugin.showToast(this.translateTexts['attendance.no_result']);
      }
    } catch (err) {
      loading.dismiss();
      console.log(err);
      this.errTip = err;
    }
  }

  async cancelSign() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.present();

    const sendData: any = {
      KIND: 'MHTVISIT',
      DOCNO: this.applyList.DOCNO,
    };
    try {
      const res: any = await this.visitorService.CancelSignData(sendData);
      this.isSending = true;
      console.log(res);
      loading.dismiss();
      this.plugin.showToast(this.translateTexts['attendance.callbackSign_succ']);

    } catch (e) {
      loading.dismiss();
      console.log(e);
      this.plugin.showToast(this.translateTexts['attendance.callbackSign_err']);
    }
  }

  async  delete() {
    const alert = await this.alertCtrl.create({
      header: this.translateTexts['attendance.deleteForm'],
      message: this.translateTexts['attendance.delete_alert'],
      buttons: [
        {
          text: this.translateTexts['messagecomponent.cancel'],
          role: 'cancel',
          handler: () => { }
        },
        {
          text: this.translateTexts['inspection.ipqa.confirm'],
          handler: () => {
            this.visitorService.delete(this.applyList.ID).then(r => {
              if (r[0] === '0' || r[1] === '0') {
                this.plugin.showToast(this.translateTexts['delete_fail']);
              } else {
                this.plugin.showToast(this.translateTexts['delete_succ']);
                this.navCtrl.pop();
              }
            });
          }
        }
      ]
    });
    await alert.present();
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

  addvisitor() {
    let modal: any;
    if (this.type === 'emp') {
      if (this.visitorsdata === '') {
        modal = this.modalCtrl.create({
          component: AddEmployeesComponent,
          componentProps: {
            title: this.translateTexts['visit.add.addvisitor']
          }
        });
      } else {
        modal = this.modalCtrl.create({
          component: AddEmployeesComponent,
          componentProps: {
            data: this.visitorsdata,
            title: this.translateTexts['visit.add.editvisitor']
          }
        });
      }
    } else {
      if (this.visitorsdata === '') {
        modal = this.modalCtrl.create({
          component: AddVisitorsComponent,
          componentProps: {
            title: this.translateTexts['visit.add.addvisitor']
          }
        });
      } else {
        modal = this.modalCtrl.create({
          component: AddVisitorsComponent,
          componentProps: {
            data: this.visitorsdata,
            title: this.translateTexts['visit.add.editvisitor']
          }
        });
      }
    }

    modal.present();
  }

  registerGoods(type?: any) {
    let remodal: any;
    if (type) {
      if (this.goodsdata === '') {
        remodal = this.modalCtrl.create({
          component: AddGoodsComponent,
          componentProps: {
            formPage: this.type,
            type: type.value,
            title: this.translateTexts['visit.add.addgoods']
          }
        });
      } else {
        remodal = this.modalCtrl.create({
          component: AddGoodsComponent,
          componentProps: {
            formPage: this.type,
            type: type.value,
            title: this.translateTexts['visit.add.editgoods'],
            data: this.goodsdata,
          }
        });
      }
    } else {
      if (this.goodsdata === '') {
        remodal = this.modalCtrl.create({
          component: AddGoodsComponent,
          componentProps: {
            formPage: this.type,
            title: this.translateTexts['visit.add.addgoods']
          }
        });
      } else {
        remodal = this.modalCtrl.create({
          component: AddGoodsComponent,
          componentProps: {
            formPage: this.type,
            title: this.translateTexts['visit.add.editgoods'],
            data: this.goodsdata,
          }
        });
      }
    }

    remodal.present();
  }

  async snedApply() {
    // 外部访客扫码提交申请
    const data: any = {
      ID: 0,
      DOCUMENT_ID: this.applyForm.value.ID,
      STATUS: this.scanType,
      PROCESS_FLAG: 0,
    };
    const res = await this.visitorService.sendApplyList(data);
    if (res) {
      this.plugin.showToast(this.translateTexts['visit.add.apply_success']);
      this.navCtrl.pop();
    } else {
      this.plugin.showToast(this.translateTexts['visit.add.apply_failed']);
    }
  }

}
