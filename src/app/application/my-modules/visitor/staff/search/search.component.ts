import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CalendarState } from '../../shared/models/calendar.model';
import { VisitorService } from '../../shared/service/visitor.service';
import * as moment from 'moment';


@Component({
  selector: 'sg-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent implements OnInit {

  User: any;
  applyTime: CalendarState;
  createTime: CalendarState;
  orderNo = '';
  applicant = '';
  tempempno = '';
  type = '';
  role = '';
  starttime = new Date(new Date().setDate(1));
  endtime = new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));

  constructor(
    private visitorService: VisitorService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.User = JSON.parse(localStorage.getItem('currentUser'));
    this.role = localStorage.getItem('visitorrole');
    this.applicant = this.User.empno;
    this.tempempno = this.User.id;
    this.type = '';
    this.applyTime = {
      date: null,
      defaultValue: undefined,
      show: false,
      pickTime: false,
      type: 'range',
      enterDirection: '',
      rowSize: 'normal',
      showShortcut: true,
      infinite: true,
      startdate: '',
      enddate: '',
      minDate: new Date(+new Date() - 31536000000),
      maxDate: new Date(+new Date() + 31536000000),
    };
    this.createTime = Object.assign({}, this.applyTime);
    // 申请时间设置默认值
    this.createTime.startdate = moment(this.starttime).format('YYYY-MM-DD');
    this.createTime.enddate = moment(this.endtime).format('YYYY-MM-DD');
    console.log(this);
  }


  init() {
    this.applicant = this.User.empno;
    this.tempempno = this.User.id;
    this.type = '';
    this.orderNo = '';
    this.applyTime = {
      date: null,
      defaultValue: undefined,
      show: false,
      pickTime: false,
      type: 'range',
      enterDirection: '',
      rowSize: 'normal',
      showShortcut: true,
      infinite: true,
      startdate: '',
      enddate: '',
      minDate: new Date(+new Date() - 31536000000),
      maxDate: new Date(+new Date() + 31536000000),
    };
    this.createTime = Object.assign({}, this.applyTime);
    // 申请时间设置默认值
    this.createTime.startdate = moment(this.starttime).format('YYYY-MM-DD');
    this.createTime.enddate = moment(this.endtime).format('YYYY-MM-DD');
  }



  /*申请时间*/
  chooseCreateTime() {
    // 第一个时间区间
    this.createTime.show = true;
    this.createTime.defaultValue = [this.starttime, this.endtime];
  }

  createTimeCancel() {
    this.createTime.show = false;
  }

  createTimeConfirm(value) {
    const startdate = moment(value.startDate).format('YYYY-MM-DD');
    const enddate = moment(value.endDate).format('YYYY-MM-DD');
    this.createTime = {
      ...this.createTime,
      ...{ show: false, startdate, enddate }
    };
    this.createTimeCancel();
  }



  /*到访时间*/
  chooseApplyTime() {
    // 第二个时间区间
    this.applyTime.show = true;
  }

  applyTimeCancel() {
    this.applyTime.show = false;
  }

  applyTimeConfirm(value) {
    this.applyTime.startdate = moment(value.startDate).format('YYYY-MM-DD');
    this.applyTime.enddate = moment(value.endDate).format('YYYY-MM-DD');
    this.applyTimeCancel();
  }

  // 重置
  Reset() {
    this.init();
  }

  ctimeClear() {
    this.createTime.startdate = '';
    this.createTime.enddate = '';
  }

  atimeClear() {
    this.applyTime.startdate = '';
    this.applyTime.enddate = '';
  }


  // 查询
  async submitForm() {
    console.log(this.applicant);
    let userid, empno;
    if (this.role === 'VISIT_ADMIN') {
      if (this.applicant === '') {
        userid = '';
        empno = '';
      } else {
        userid = this.tempempno;
        empno = this.applicant;
      }
    } else {
      userid = this.User.id;
    }

    let data = {
      userid: userid,
      apply_empno: empno,
      docno: this.orderNo,
      s_apply_date: this.applyTime.startdate,
      e_apply_date: this.applyTime.enddate,
      s_create_date: this.createTime.startdate,
      e_create_date: this.createTime.enddate,
      status: this.type,
      phone: '',
      check: '',
    };
    console.log(data);
    this.router.navigate(['/tabs/application/visitor/result', data]);
  }

}
