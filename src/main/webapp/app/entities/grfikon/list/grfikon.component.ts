import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrfikon } from '../grfikon.model';
import { GrfikonService } from '../service/grfikon.service';
import { GrfikonDeleteDialogComponent } from '../delete/grfikon-delete-dialog.component';

@Component({
  selector: 'jhi-grfikon',
  templateUrl: './grfikon.component.html',
})
export class GrfikonComponent implements OnInit {
  grfikons?: IGrfikon[];
  isLoading = false;

  constructor(protected grfikonService: GrfikonService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.grfikonService.query().subscribe({
      next: (res: HttpResponse<IGrfikon[]>) => {
        this.isLoading = false;
        this.grfikons = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ucitajGrafikon(): void {
    this.grfikonService.grafikon().subscribe(res => {
      const region = res.map((res: { region: string }) => res.region);
      const promet = res.map((res: { promet: number }) => res.promet);
      // eslint-disable-next-line no-console
      console.log(region);
      // eslint-disable-next-line no-console
      console.log(promet);
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.ucitajGrafikon();
  }

  trackId(index: number, item: IGrfikon): number {
    return item.id!;
  }

  delete(grfikon: IGrfikon): void {
    const modalRef = this.modalService.open(GrfikonDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.grfikon = grfikon;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
