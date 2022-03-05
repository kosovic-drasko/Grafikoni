import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrfikon } from '../grfikon.model';

@Component({
  selector: 'jhi-grfikon-detail',
  templateUrl: './grfikon-detail.component.html',
})
export class GrfikonDetailComponent implements OnInit {
  grfikon: IGrfikon | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grfikon }) => {
      this.grfikon = grfikon;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
