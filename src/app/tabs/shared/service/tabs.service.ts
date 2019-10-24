import { Injectable, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { injectStyles } from 'shadow-dom-inject-styles';

@Injectable({
  providedIn: 'root',
})
export class TabsService {
  constructor(
    private router: Router,
    private platform: Platform,
    // private el: ElementRef,
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
      this.tabsDisplayType('show');
    } else {
      console.log('hide');
      this.tabsDisplayType('hide');
    }
  }



  public tabsDisplayType(type: string) {
    setTimeout(() => {
      const tabBar = document.getElementById('FirstTabBar');
      // console.log(tabBar, 1);
      // const toolbar = (this.el.nativeElement.querySelector('ion-app > ion-tabs') as HTMLElement);
      const styles = `
        .tabbar-hide {
          display: none !important;
        }
      `;
      if (type === 'show') {
        injectStyles(tabBar, '.tabbar-hide', styles);
      }
    }, 100);
  }
}
