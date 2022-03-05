import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrfikon } from '../grfikon.model';
import { GrfikonService } from '../service/grfikon.service';
import { GrfikonDeleteDialogComponent } from '../delete/grfikon-delete-dialog.component';
// import {Chart} from "chart.js";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'jhi-grfikon',
  templateUrl: './grfikon.component.html',
  styleUrls: ['./grfikon.component.css'],
})
export class GrfikonComponent implements OnInit {
  grfikons?: IGrfikon[];
  isLoading = false;
  chart: any = [];
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
    this.grfikonService.grafikon().subscribe((res: any[]) => {
      const region = res.map((res: { region: string }) => res.region);
      const promet = res.map((res: { promet: number }) => res.promet);
      // eslint-disable-next-line no-console
      console.log(region);
      // eslint-disable-next-line no-console
      console.log(promet);
      this.chart = new Chart('canvas', {
        // type: 'bar',

        type: 'pie',
        options: {
          // horizontalna varijanta
          indexAxis: 'y',
          plugins: {
            legend: {
              display: true,
              labels: {
                color: 'rgb (255, 99, 132)',
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },

        data: {
          labels: region,
          datasets: [
            {
              data: promet,
              backgroundColor: ['red', 'yellow'],
              borderColor: '#3cba9f',
              borderWidth: 1,
            },
          ],
        },
      });
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
  print(): any {
    window.print();
  }
}
