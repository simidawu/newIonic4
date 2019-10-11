import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

const tabsRoutes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'application',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../application/application.module').then(m => m.ApplicationModule)
          }
        ]
      },
      {
        path: 'contact',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../contact/contact.module').then(m => m.ContactModule)
          }
        ]
      },
      {
        path: 'me',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../me/me.module').then(m => m.MeModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/application',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/application',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(tabsRoutes)],
  exports: [RouterModule],
})
export class TabsRoutingModule { }
