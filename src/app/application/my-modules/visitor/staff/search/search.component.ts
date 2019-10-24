import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
// import { AttendanceService } from '../../../attendance/shared/service/attendance.service';
import { VisitorService } from '../../shared/service/visitor.service';
import * as moment from 'moment';

@Component({
  selector: 'sg-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  private searchTerms = new Subject<string>();

  orderNo: string;
  applicant: string;
  tempempno: string;
  s_apply_date = '';
  e_apply_date = '';
  s_create_date = '';
  e_create_date = '';
  type = '';
  role = '';


  isSelectcolleague = false; // 判断是否正确选择申请人
  tempcolleague = ''; // 临时作保存的中间申请人
  colleague = ''; // 搜索得到的申请人

  constructor(
    private visitorService: VisitorService,
    // private attendanceService: AttendanceService,
  ) { }


  // ionViewDidEnter() {
  //   this.init();
  //   this.role = this.navParams.get('role');
  //   this.colleague = this.searchTerms
  //     .asObservable()
  //     .debounceTime(300)
  //     .distinctUntilChanged()
  //     .switchMap(term => {
  //       if (term.trim().length > 0) {
  //         return this.attendanceService.getAgent(term);
  //       } else {
  //         return Observable.of<any>([]);
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       return Observable.of<any>([]);
  //     });
  // }


  init(r?: any) {
    this.orderNo = '';
    this.applicant = '';
    if (r === undefined) {
      this.s_create_date = moment(new Date().setDate(1)).format('YYYY-MM-DD');
      this.e_create_date = moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).format('YYYY-MM-DD');
    } else {
      this.s_create_date = '';
      this.e_create_date = '';
    }
    this.s_apply_date = '';
    this.e_apply_date = '';
    this.type = '';
    this.tempempno = '';
  }


  // 重置
  Reset() {
    this.init(1);
  }


  // 搜索申请人
  searchapplicant(item: any) {
    if (this.tempcolleague) {
      this.isSelectcolleague = item.value !== this.tempcolleague ? false : true;
    }
    this.searchTerms.next(item.value);
  }


  // 回填申请人
  async getcolleague(name: string) {
    this.isSelectcolleague = true;
    this.tempcolleague = name;
    this.searchTerms.next('');
    const strArray = name.split(",");
    this.applicant = strArray[0];
    const employee = await this.visitorService.getEmployee(strArray[0]);
    this.tempempno = employee[0]['ID'];
  }


  async submitForm() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let userid, apply_empno;
    if (this.role == 'ADMIN') {
      if (this.applicant == '') {
        userid = '';
        apply_empno = '';
      } else {
        userid = this.tempempno;
        apply_empno = this.applicant;
      }
    } else {
      userid = currentUser.id;
    }

    let data = {
      userid: userid,
      apply_empno: apply_empno,
      docno: this.orderNo,
      s_apply_date: this.s_apply_date,
      e_apply_date: this.e_apply_date,
      s_create_date: this.s_create_date,
      e_create_date: this.e_create_date,
      status: this.type,
      phone: '',
      check: '',
    };
    // this.navCtrl.push('ResultListComponent', {
    //   searchdata: data,
    // });
  }

}
