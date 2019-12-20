import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';

const AppsRoutes: Routes = [
  { path: '', component: ContactComponent },
  { path: 'search', component: SearchResultComponent },
  { path: 'detail', component: ContactDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(AppsRoutes)],
  exports: [RouterModule],
})
export class ContactRoutingModule { }
