import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GrfikonDetailComponent } from './grfikon-detail.component';

describe('Grfikon Management Detail Component', () => {
  let comp: GrfikonDetailComponent;
  let fixture: ComponentFixture<GrfikonDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrfikonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grfikon: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GrfikonDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrfikonDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grfikon on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grfikon).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
