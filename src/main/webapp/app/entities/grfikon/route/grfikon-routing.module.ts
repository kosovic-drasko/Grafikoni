import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GrfikonComponent } from '../list/grfikon.component';
import { GrfikonDetailComponent } from '../detail/grfikon-detail.component';
import { GrfikonUpdateComponent } from '../update/grfikon-update.component';
import { GrfikonRoutingResolveService } from './grfikon-routing-resolve.service';

const grfikonRoute: Routes = [
  {
    path: '',
    component: GrfikonComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrfikonDetailComponent,
    resolve: {
      grfikon: GrfikonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrfikonUpdateComponent,
    resolve: {
      grfikon: GrfikonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrfikonUpdateComponent,
    resolve: {
      grfikon: GrfikonRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(grfikonRoute)],
  exports: [RouterModule],
})
export class GrfikonRoutingModule {}
