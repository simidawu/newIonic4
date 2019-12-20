import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactComponent } from './contact.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ContactRoutingModule } from './contact-routing.module';
import { SearchResultComponent } from './search-result/search-result.component';
import { ContactService } from './shared/service/contact.service';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';

@NgModule({
  declarations: [
    ContactComponent,
    SearchResultComponent,
    ContactListComponent,
    ContactDetailComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ContactRoutingModule,
    TranslateModule
  ],
  providers: [ContactService],
})
export class ContactModule { }
