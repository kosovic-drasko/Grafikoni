import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrfikon } from '../grfikon.model';
import { GrfikonService } from '../service/grfikon.service';

@Component({
  templateUrl: './grfikon-delete-dialog.component.html',
})
export class GrfikonDeleteDialogComponent {
  grfikon?: IGrfikon;

  constructor(protected grfikonService: GrfikonService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.grfikonService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
