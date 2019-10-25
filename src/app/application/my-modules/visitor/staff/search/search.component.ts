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
  ) { }

  ngOnInit() {
    this.User = JSON.parse(localStorage.getItem('currentUser'));
    this.orderNo = this.User.empno;
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


  onChange(result: Date): void {
    console.log('onChange: ', result);
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
