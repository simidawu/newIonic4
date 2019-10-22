import { Component, OnInit } from '@angular/core';
import { MyModule } from './../shared/models/user.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ApplicationService } from './shared/service/application.service';
@Component({
  selector: 'sg-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit {

  items: MyModule[]; // 不分类的所有数据
  itemsByGroup: MyModule[][] = []; // 按group分组
  showBtn = false; // 控制是否显示右上角的减号
  mySub: Subscription;
  constructor(
    private router: Router,
    private appService: ApplicationService,
  ) { }

  ngOnInit() {
    this.appService.getAllTips();
    this.mySub = this.appService.observeModulesY().subscribe(ms => {
      this.items = ms;
      this.itemsByGroup = this.selectItems(this.items);
    });
  }

  // 作用：用于把一维数组的数据按group分成二维数组存储
  selectItems(data: MyModule[]): MyModule[][] {
    let temp: MyModule[][] = [];
    let groupTypes: string[] = [];
    for (let i = 0; i < data.length; i++) {
      if (groupTypes.indexOf(data[i].GROUP_NAME) === -1) {
        groupTypes.push(data[i].GROUP_NAME);
      }
    }

    // 数组初始化
    for (let i = 0; i < groupTypes.length; i++) {
      temp[i] = [];
    }

    for (let i = 0; i < groupTypes.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].GROUP_NAME === groupTypes[i]) {
          temp[i].push(data[j]);
        }
      }
    }

    return temp;
  }

  showEditBtn(): void {
    this.showBtn = true;
  }

  hideEditBtn(): void {
    this.showBtn = false;
  }

  goToMorePage(): void {
    this.router.navigate(['/tabs/application/more']);
  }

  goToDetailPage(id: number) {
    const page = this.translateID(id);
    // console.log(page);
    // this.router.navigate(['/tabs/application/' + page, { moduleID: id }]);
    this.router.navigate(['/tabs/application/' + page]);
  }

  translateID(id: number) {
    let url = '';
    switch (id) {
      case 1:
        url = 'book';
        break;
      case 21:
        url = 'attendance';
        break;
      case 22:
        url = 'signature';
        break;
      case 61:
        url = 'inspection';
        break;
      case 81:
        url = 'activity';
        break;
      case 26023:
        url = 'survey';
        break;
      case 26031:
        url = 'reservation';
        break;
      case 26273:
        url = 'visitor';
        break;
      case -1:
        url = 'tax';
        break;
      default:
        break;
    }
    return url;
  }
}
