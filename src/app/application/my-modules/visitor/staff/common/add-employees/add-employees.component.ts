import { NavParams, Events, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { timeout, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { PluginService } from '../../../../../../core/services/plugin.service';
import { VisitorService } from '../../../shared/service/visitor.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'sg-add-employees',
  templateUrl: 'add-employees.component.html',
  styleUrls: ['./add-employees.component.scss'],
})

class emps {
  employees: employee[];
  constructor() { }
}

class employee {
  ID = 0;
  USER_NAME = '';
  PERSON_NAME = '';
  EMPNO = '';
}

export class AddEmployeesComponent implements OnInit {

  private searchEmp = new Subject<string>();

  translateTexts: any;
  empForm: FormGroup;
  title: string;
  employee: Observable<string[]>; // 搜索得到的候选员工
  tempemployee: string;
  isSelectemployee = false; // 验证框内员工名
  currentIndex: number;

  constructor(
    private fb: FormBuilder,
    public navParams: NavParams,
    private events: Events,
    private alertCtrl: AlertController,
    private plugin: PluginService,
    private visitorService: VisitorService,
    private translate: TranslateService,
  ) { }



  async ngOnInit() {
    this.subscribeTranslateText();
    this.init();
    const data = this.navParams.get('data');
    this.title = this.navParams.get('title');  // 標題
    if (data) {
      this.isSelectemployee = true;
      const empsArr = this.empForm.controls['employees'] as FormArray;
      for (let i = 0; i <= data.length - 1; i++) {
        if (i !== 0) {
          this.addEmpGroup();
        }
        const empsGou = empsArr.controls[i] as FormGroup;
        const dataID = data[i].ID ? data[i].ID : '';
        empsGou.controls['ID'].setValue(dataID);
        empsGou.controls['USER_NAME'].setValue(data[i].USER_NAME);
        empsGou.controls['PERSON_NAME'].setValue(data[i].PERSON_NAME);
        empsGou.controls['EMPNO'].setValue(data[i].EMPNO);
      }
    }
    this.employee = this.searchEmp
      .asObservable().pipe(
        timeout(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
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
  }


  subscribeTranslateText() {
    this.translate
      .get([
        'visit.add.delVisitorTitle',
        'visit.add.delVisitorMessage',
        'visit.add.No',
        'visit.add.card_error',
        'visit.add.pnameEntry_error',
        'messagecomponent.confirm',
        'messagecomponent.cancel',
        'taxModule.submit_success'
      ])
      .subscribe(res => {
        this.translateTexts = res;
      });
  }


  init() {
    this.empForm = this.initForm(new emps());
  }


  /**
   * 初始化基础FormGroup
   *
   * @param {*} 需要绑定的数据
   * @returns {FormGroup}
   */
  initForm(work: any = {}): FormGroup {
    return this.fb.group({
      employees: this.fb.array([
        this.initSubForm(work.employees ? work.employees : new employee()),
      ]),
    });
  }


  initSubForm(work: any) {
    let sub: any;
    sub = this.fb.group(
      {
        ID: [work.ID],
        USER_NAME: [work.USER_NAME, Validators.required],
        PERSON_NAME: [work.PERSON_NAME, Validators.required],
        EMPNO: [work.EMPNO, Validators.required],
      },
    );
    return sub;
  }

  // 搜索申请人
  searchemployee(item: any, index: number) {
    this.currentIndex = index;
    // 判断是否正确选择申请人
    if (this.tempemployee) {
      this.isSelectemployee = item.value != this.tempemployee ? false : true;
    }
    this.searchEmp.next(item.value);
  }

  // 回填申请人和电话
  async getemployee(index: number, item: any) {
    this.isSelectemployee = true;
    this.searchEmp.next('');
    this.tempemployee = item.NICK_NAME;
    const fg = this.empgroups.controls[index] as FormGroup;
    fg.controls['USER_NAME'].setValue(item.USER_NAME);
    fg.controls['PERSON_NAME'].setValue(item.NICK_NAME);
    fg.controls['EMPNO'].setValue(item.EMPNO);
  }


  // 添加一組
  addEmpGroup() {
    let noerror = true;
    for (let i = 0; i < this.empgroups.controls.length; i++) {
      const fg = this.empgroups.controls[i] as FormGroup;
      if (fg.controls['USER_NAME'].status === "INVALID") {
        this.plugin.showToast(this.translateTexts['visit.add.No'] + (i + 1) + this.translateTexts['visit.add.pnameEntry_error']);
      } else if (fg.controls['PERSON_NAME'].status === "INVALID") {
        this.plugin.showToast(this.translateTexts['visit.add.No'] + (i + 1) + this.translateTexts['visit.add.pnameEntry_error']);
      } else if (fg.controls['EMPNO'].status === "INVALID") {
        this.plugin.showToast(this.translateTexts['visit.add.No'] + (i + 1) + this.translateTexts['visit.add.pnameEntry_error']);
      } else if (i === this.empgroups.controls.length - 1) {
        noerror = false;
      }
    }
    if (!noerror) {
      this.empgroups.push(this.initSubForm(new employee()));
      return;
    }
  }


  // 刪除一組
  async removeEmpGroup(index: any) {
    const vid = this.empgroups.at(index).value.ID;
    if (vid > 0) {
      const alert = await this.alertCtrl.create({
        header: this.translateTexts['visit.add.delVisitorTitle'],
        message: this.translateTexts['visit.add.delVisitorMessage'],
        buttons: [
          {
            text: this.translateTexts['messagecomponent.cancel'],
            handler: () => { },
          },
          {
            text: this.translateTexts['messagecomponent.confirm'],
            handler: () => {
              this.visitorService.delVisitor(vid);
              this.empgroups.removeAt(index);
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.empgroups.removeAt(index);
    }

  }

  get empgroups(): FormArray {
    return this.empForm.get('employees') as FormArray;
  }

  submitForm(): void {
    // senddata.data = this.empForm.value.employees;
    let data = [];
    for (let i = 0; i < this.empForm.value.employees.length; i++) {
      data.push(this.empForm.value.employees[i].PERSON_NAME)
    }
    const namedata = data.join(',');

    const senddata = {
      data: this.empForm.value.employees,
      status: '1',
      namedata: namedata,
    };
    // senddata.namedata = namedata;
    this.events.publish('service:fillinVisitors', senddata);
    // this.viewCtrl.dismiss();
  }

  goBack() {
    // this.viewCtrl.dismiss();
  }

}



