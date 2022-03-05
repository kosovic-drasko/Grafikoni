import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'grfikon',
        data: { pageTitle: 'Grfikons' },
        loadChildren: () => import('./grfikon/grfikon.module').then(m => m.GrfikonModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
