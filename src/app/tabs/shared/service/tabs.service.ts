import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class TabsService {
  constructor(
    private router: Router,
    private platform: Platform,
  ) {
    this.platform.ready().then(() => {
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        // console.log(event);
        this.showHideTabs(event);
      });
    });
  }

  private showHideTabs(e: any) {
    // 将urlAfterRedirects拆分成一个数组
    const urlssArray = e.urlAfterRedirects.split('/');
    // console.log(urlssArray);
    // 获取parenturl
    const pageUrlParents = urlssArray[urlssArray.length - 2];
    // console.log("父：" + pageUrlParents);
    if (pageUrlParents === 'tabs') {
      console.log('show');
      // this.showTabs();
    } else {
      console.log('hide');
      // this.hideTabs();
    }
  }

  public hideTabs() {
    const tabBar = document.getElementById('FirstTabBar');
    console.log(tabBar, 1);
    if (tabBar.style.display !== 'none') {
      tabBar.style.display = 'node';
    }
  }

  public showTabs() {
    const tabBar = document.getElementById('FirstTabBar');
    console.log(tabBar, 2);
    if (tabBar.style.display !== 'flex') {
      tabBar.style.display = 'flex';
    }
  }
}
