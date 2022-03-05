import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GrfikonService } from '../service/grfikon.service';
import { IGrfikon, Grfikon } from '../grfikon.model';

import { GrfikonUpdateComponent } from './grfikon-update.component';

describe('Grfikon Management Update Component', () => {
  let comp: GrfikonUpdateComponent;
  let fixture: ComponentFixture<GrfikonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grfikonService: GrfikonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GrfikonUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GrfikonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrfikonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grfikonService = TestBed.inject(GrfikonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const grfikon: IGrfikon = { id: 456 };

      activatedRoute.data = of({ grfikon });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(grfikon));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grfikon>>();
      const grfikon = { id: 123 };
      jest.spyOn(grfikonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grfikon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grfikon }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(grfikonService.update).toHaveBeenCalledWith(grfikon);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grfikon>>();
      const grfikon = new Grfikon();
      jest.spyOn(grfikonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grfikon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grfikon }));
      saveSubject.complete();

      // THEN
      expect(grfikonService.create).toHaveBeenCalledWith(grfikon);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grfikon>>();
      const grfikon = { id: 123 };
      jest.spyOn(grfikonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grfikon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grfikonService.update).toHaveBeenCalledWith(grfikon);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
