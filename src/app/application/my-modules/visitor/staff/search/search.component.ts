import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { VisitorService } from '../../shared/service/visitor.service';
import * as moment from 'moment';

@Component({
  selector: 'sg-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  User: any;
  orderNo = '';
  applicant = '';
  tempempno = '';
  startValue: Date | null = null;
  endValue: Date | null = null;
  endOpen = false;
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
  ) { }

  ngOnInit() {
    this.User = JSON.parse(localStorage.getItem('currentUser'));
    this.applicant = this.User.empno;
    this.tempempno = this.User.id;
    console.log(this);
  }

  // ionViewDidEnter() {
  //   this.init();
  //   this.role = this.navParams.get('role');
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

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  onStartChange(date: Date): void {
    this.startValue = date;
  }

  onEndChange(date: Date): void {
    this.endValue = date;
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
    console.log('handleStartOpenChange', open, this.endOpen);
  }

  handleEndOpenChange(open: boolean): void {
    console.log(open);
    this.endOpen = open;
  }

  // 重置
  Reset() {
    this.init(1);
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
