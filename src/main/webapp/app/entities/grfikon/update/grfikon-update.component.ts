import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IGrfikon, Grfikon } from '../grfikon.model';
import { GrfikonService } from '../service/grfikon.service';

@Component({
  selector: 'jhi-grfikon-update',
  templateUrl: './grfikon-update.component.html',
})
export class GrfikonUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    region: [],
    promet: [],
  });

  constructor(protected grfikonService: GrfikonService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grfikon }) => {
      this.updateForm(grfikon);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grfikon = this.createFromForm();
    if (grfikon.id !== undefined) {
      this.subscribeToSaveResponse(this.grfikonService.update(grfikon));
    } else {
      this.subscribeToSaveResponse(this.grfikonService.create(grfikon));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrfikon>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(grfikon: IGrfikon): void {
    this.editForm.patchValue({
      id: grfikon.id,
      region: grfikon.region,
      promet: grfikon.promet,
    });
  }

  protected createFromForm(): IGrfikon {
    return {
      ...new Grfikon(),
      id: this.editForm.get(['id'])!.value,
      region: this.editForm.get(['region'])!.value,
      promet: this.editForm.get(['promet'])!.value,
    };
  }
}
