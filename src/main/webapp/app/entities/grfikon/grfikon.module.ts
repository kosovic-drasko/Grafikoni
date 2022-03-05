import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GrfikonComponent } from './list/grfikon.component';
import { GrfikonDetailComponent } from './detail/grfikon-detail.component';
import { GrfikonUpdateComponent } from './update/grfikon-update.component';
import { GrfikonDeleteDialogComponent } from './delete/grfikon-delete-dialog.component';
import { GrfikonRoutingModule } from './route/grfikon-routing.module';

@NgModule({
  imports: [SharedModule, GrfikonRoutingModule],
  declarations: [GrfikonComponent, GrfikonDetailComponent, GrfikonUpdateComponent, GrfikonDeleteDialogComponent],
  entryComponents: [GrfikonDeleteDialogComponent],
})
export class GrfikonModule {}
