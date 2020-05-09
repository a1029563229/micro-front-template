import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, NzTableModule, NzAvatarModule],
  bootstrap: [ListComponent],
})
export class ListModule {}
