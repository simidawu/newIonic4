import {
  NavController,
  AlertController,
  ModalController,
  PopoverController,
  NavParams,
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

  type: string; // 单据类型
  STATUS: string = '';// 单据状态

  cantEdit: boolean = false; // 字段是否允许修改
  outcantEdit: boolean = true; // 字段是否允许外部访客修改

  isSelectcolleague: boolean = false; // 判断是否正确选择申请人
  tempcolleague: string = ''; // 临时作保存的中间申请人
  colleague: any; // api返回搜索申请人結果
  APPLY_EMPNO: '';// 申请人工号
  APPLY_SITE: ''; // 申请人所属公司
  getTime = 0; // 手机号码发送验证请求延时

  isSelectDept: boolean = false; // 判断是否正确选择费用部门
  tempDept: string = ''; // 临时作保存的费用部门
  DeptList: any; // 搜索得到的费用部门
  DeptNo: string = '';//费用部门id

  specarealist: any[]; //特殊门禁
  arealist: any[]; //到访区域

  visitorsdata: any = ''; //存放来访人员数据
  goodsdata: any = []; //存放物品登记数据
  toolTypeList: any = []; //施工物品分类


  isSending: boolean = false;//是否送签中
  isVisitor: boolean = false;//是否为外部访客

  scanType: string = '';//外部访客扫描二维码类型

  //页面错误提示
  errTip: string = '';
  timeError: string = '';
  APPLY_MOBILE_Error: string = '';
  ACESS_TEL_Error: string = '';
  OVERSEER_INTEL_Error: string = '';
  OVERSEER_OUTTEL_Error: string = '';
  CHARGE_TEL_Error: string = '';

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public navParams: NavParams,
    private plugin: PluginService,
    private visitorService: VisitorService,
    private events: Events,
    private translate: TranslateService,
    private validateService: ValidateService,
  ) { }

  ionViewWillEnter() {
    this.scanType = this.navParams.get('scanType') == undefined ? '' : this.navParams.get('scanType');
  }

  async ngOnInit() {
    let formData = this.navParams.get('formData');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.subscribeTranslateText();
    if (formData) {
      console.log(formData);
      this.isVisitor = this.navParams.get('outtype') == undefined ? false : this.navParams.get('outtype');
      this.applyList = formData;
      this.applyList.toolTypeSelect = '';
      this.type = formData.TYPE;
      this.STATUS = formData.STATUS;
      this.tempcolleague = formData.APPLY_NAME;
      this.tempDept = formData.CHARGE_DEPTNAME;
      if (!this.isVisitor) {
        if (this.STATUS == 'WAITING' || this.STATUS == 'APPROVED') {
          this.cantEdit = true;
        }
      } else {
        this.cantEdit = true;
        this.outcantEdit = false;
      }

      if (formData.PROCESS_FLAG == 1) {
        this.isSending = true;
      }
      // 获取特殊门禁和到访区域
      let list = await this.visitorService.getArea(this.type);
      let newlist: any[] = list.json();
      this.specarealist = newlist.filter(value => value.MACHINE_ID);
      this.arealist = newlist.filter(value => !value.MACHINE_ID);

      if (formData.FREE_MEAL == 'Y') {
        this.applyList.FREE_MEAL = true;
      } else {
        this.applyList.FREE_MEAL = false;
      }

      if (formData.NETWORK == 'Y') {
        this.applyList.NETWORK = true;
      } else {
        this.applyList.NETWORK = false;
      }

      if (formData.APPLY_DATE !== '') {
        this.applyList.CREATION_DATE = formData.APPLY_DATE;
      }

      this.APPLY_EMPNO = formData.APPLY_EMPNO;
      this.APPLY_SITE = formData.APPLY_SITE;
      this.DeptNo = formData.CHARGE_DEPTNO;
      if (formData.AREA_IDS !== '') {
        let dataArr1: any[] = [];
        let areaArr = formData.AREA_IDS.split(",")

        this.specarealist.forEach(value => {
          if (areaArr.includes(value.ID + "")) {
            dataArr1.push(value.ID);
          }
        });
        this.applyList.specArea = dataArr1 == undefined ? [] : dataArr1;

        let dataArr2: any[] = [];
        this.arealist.forEach(value => {
          if (areaArr.includes(value.ID + "")) {
            dataArr2.push(value.ID);
          }
        });

        this.applyList.visitArea = dataArr2 == undefined ? [] : dataArr2;
      } else {
        this.applyList.specArea = [];
        this.applyList.visitArea = [];
      }

      this.visitorsdata = formData.visitorsdata;
      let vdata = [];
      for (let i = 0; i <= this.visitorsdata.length - 1; i++) {
        vdata.push(this.visitorsdata[i].PERSON_NAME);
      }
      this.applyList.visitors = vdata.join(',');
      this.goodsdata = formData.goodsdata;
      let gdata = [];
      for (let i = 0; i <= this.goodsdata.length - 1; i++) {
        this.goodsdata[i].GOODS_BRAND = this.goodsdata[i].GOODS_BRAND == null ? '' : this.goodsdata[i].GOODS_BRAND;
        this.goodsdata[i].GOODS_MODEL = this.goodsdata[i].GOODS_MODEL == null ? '' : this.goodsdata[i].GOODS_MODEL;
        let newone = this.goodsdata[i].GOODS_BRAND + this.goodsdata[i].GOODS_MODEL + this.goodsdata[i].GOODS_NAME + this.goodsdata[i].GOODS_QUANTITY + this.goodsdata[i].GOODS_UNIT;
        gdata.push(newone);
      }
      this.applyList.goodsList = gdata.join(',');
      this.init(this.applyList);

      this.MyValidatorControl = this.initValidator(this.applyList);
      this.myValidators = this.MyValidatorControl.validators;
    } else {
      this.type = this.navParams.get('type') == undefined ? '' : this.navParams.get('type');
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

      // 获取特殊门禁和到访区域
      let list = await this.visitorService.getArea(this.type);
      let newlist: any[] = list.json();

      this.specarealist = newlist.filter(value => value.MACHINE_ID);
      this.arealist = newlist.filter(value => !value.MACHINE_ID);
      if (this.type == 'emp') {
        this.applyList.FREE_MEAL = true;
      }
      if (this.type == 'vip' || this.type == 'ctm' || this.type == 'emp') {
        this.applyList.NETWORK = true;
      }

      this.APPLY_EMPNO = currentUser.empno;
      this.APPLY_SITE = currentUser.companyId;

      this.init(this.applyList);

      this.MyValidatorControl = this.initValidator(this.applyList);
      this.myValidators = this.MyValidatorControl.validators;
      if (!this.isVisitor) {
        let dept = await this.visitorService.getAllDepts(currentUser.department);
        this.DeptNo = dept[0]['DEPTNO'];
        this.applyForm.controls['APPLY_NAME'].setValue(currentUser.nickname);
        this.tempcolleague = currentUser.nickname;
        this.applyForm.controls['APPLY_MOBILE'].setValue(currentUser.mobile);
        this.applyForm.controls['APPLY_TEL'].setValue(currentUser.telephone);
        this.applyForm.controls['CHARGE_DEPTNAME'].setValue(currentUser.department);
        this.tempDept = currentUser.department;
      }
    }
    this.isSelectcolleague = true;
    this.isSelectDept = true;
    if (this.type == 'build') {
      let data = await this.visitorService.getLookUpType(
        'GOODS_TYPE',
      );
      this.toolTypeList = data.json();
    }


    // 来访人员
    this.events.subscribe('service:fillinVisitors', (data: any) => {
      this.applyForm.controls['visitors'].setValue(data.namedata);
      this.visitorsdata = data.data;
    });
    // 物品登记
    this.events.subscribe('service:fillinGoods', (data: any) => {
      this.applyForm.controls['goodsList'].setValue(data.namedata);
      this.goodsdata = data.data;
    });

    this.colleague = this.searchTerms
      .asObservable().pipe(
        timeout(300),
        distinctUntilChanged(),
        switchMap(term => {
          if (term.trim().length > 0) {
            return this.visitorService.getAgent(term);
          } else {
            // return Observable.of<any>([]);
            return of<any>([]);
          }
        }),
        catchError(error => {
          console.log(error);
          // return Observable.of<any>([]);
          return of<any>([]);
        })
      );

    this.DeptList = this.searchDept
      .asObservable().pipe(
        timeout(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          if (term.trim().length > 0) {
            return this.visitorService.getDepts(term);
          } else {
            // return Observable.of<any>([]);
            return of<any>([]);
          }
        }),
        catchError(error => {
          console.log(error);
          // return Observable.of<any>([]);
          return of<any>([]);
        })
      );

    this.addSubcribe();
  }

  addSubcribe() {
    for (let prop in this.myValidators) {
      this.applyForm.controls[prop].valueChanges.subscribe((value: any) => {
        this.check(value, prop);
      });
    }

    let phoneCheck = ['APPLY_MOBILE', 'ACESS_TEL', 'OVERSEER_INTEL', 'OVERSEER_OUTTEL', 'CHARGE_TEL'];
    for (let i = 0; i < phoneCheck.length; i++) {
      let check = phoneCheck[i];
      this.applyForm.controls[check].valueChanges.subscribe(() => {
        this.getTime = new Date().getTime();
        let interval = setInterval(() => {
          if (new Date().getTime() - this.getTime >= 1000) {
            this.PhoneCheck(this.applyForm.controls[check], check);
            clearInterval(interval);
          }
        }, 200)
      });
    }
  }

  subscribeTranslateText() {
    this.translate
      .get([
        'visit.add.applicant_required_err',
        'visit.add.applyPhone_required_err',
        'visit.add.constDept_required_err',
        'visit.add.visitCompany_required_err',
        'visit.add.startTime_required_err',
        'visit.add.endTime_required_err',
        'visit.add.time_err',
        'visit.add.time_err1',
        'visit.add.time_err2',
        'visit.add.time_err3',
        'visit.add.time_err4',
        'visit.add.time_err5',
        'visit.add.time_err6',
        'visit.add.visitReason_required_err',
        'visit.add.visitArea_required_err',
        'visit.add.visitorPhone_required_err',
        'visit.add.visitors_required_err',
        'visit.add.inOverseer_required_err',
        'visit.add.inOverseerPhone_required_err',
        'visit.add.outOverseer_required_err',
        'visit.add.outOverseerPhone_required_err',
        'visit.add.workHeader_required_err',
        'visit.add.workHeaderPhone_required_err',
        'visit.add.apply_success',
        'visit.add.apply_failed',
        'visit.add.addvisitor',
        'visit.add.editvisitor',
        'visit.add.addgoods',
        'visit.add.editgoods',
        'delete_succ',
        'delete_fail',
        'attendance.save_success',
        'attendance.submit_succ',
        'attendance.delete_alert',
        'attendance.deleteForm',
        'attendance.no_list',
        'inspection.ipqa.confirm',
        'meComponent.incorrectmobile',
        'messagecomponent.cancel',
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
  }

  init(form: any = {}) {
    let fb = new FormBuilder();
    this.applyForm = fb.group({
      ID: [form.ID],
      DOCNO: [form.DOCNO],
      APPLY_NAME: [form.APPLY_NAME, [Validators.required]],
      APPLY_MOBILE: [form.APPLY_MOBILE, [Validators.required]],
      APPLY_TEL: [form.APPLY_TEL],
      CREATION_DATE: [form.CREATION_DATE],
      CHARGE_DEPTNAME: [form.CHARGE_DEPTNAME, (this.type == 'vip' || this.type == 'ctm' || this.type == 'emp') && !this.isVisitor ? [Validators.required] : ''],
      ACESS_COMPANY_NAME: [form.ACESS_COMPANY_NAME, [Validators.required]],
      START_DATE: [form.START_DATE, [Validators.required]],
      END_DATE: [form.END_DATE, [Validators.required]],
      ACESS_REASON: [form.ACESS_REASON, [Validators.required]],
      specArea: [form.specArea],
      FREE_MEAL: [form.FREE_MEAL],
      NETWORK: [form.NETWORK],
      visitArea: [form.visitArea, !this.isVisitor ? [Validators.required] : ''],
      ACESS_TEL: [form.ACESS_TEL, this.type !== 'build' ? [Validators.required] : ''],
      visitors: [form.visitors, [Validators.required]],
      goodsList: [form.goodsList],
      OVERSEER_IN: [form.OVERSEER_IN, this.type == 'build' ? [Validators.required] : ''],
      OVERSEER_INTEL: [form.OVERSEER_INTEL, this.type == 'build' ? [Validators.required] : ''],
      OVERSEER_OUT: [form.OVERSEER_OUT, this.type == 'build' ? [Validators.required] : ''],
      OVERSEER_OUTTEL: [form.OVERSEER_OUTTEL, this.type == 'build' ? [Validators.required] : ''],
      CHARGE: [form.CHARGE, this.type == 'build' ? [Validators.required] : ''],
      CHARGE_TEL: [form.CHARGE_TEL, this.type == 'build' ? [Validators.required] : ''],
      REMARK: [form.REMARK],
      toolTypeSelect: [form.toolTypeSelect],
    },
      { validator: this.STATUS == '' || this.STATUS === 'NEW' || this.STATUS === 'CANCELED' ? [this.timeCheck.bind(this)] : '' },
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

  // PhoneCheck(control: FormGroup): any {
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
    // let compare = this.myValidators[name].compare ? this.myValidators[this.myValidators[name].compare] : '';
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
        this.applyForm.controls['ID'].setValue(this.applyList.ID == 0 ? rtn['ID'] : this.applyList.ID);
        this.applyForm.controls['DOCNO'].setValue(this.applyList.DOCNO == '' ? rtn['DOCNO'] : this.applyList.DOCNO);
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
