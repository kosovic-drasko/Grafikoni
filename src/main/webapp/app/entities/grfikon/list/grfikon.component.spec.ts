import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GrfikonService } from '../service/grfikon.service';

import { GrfikonComponent } from './grfikon.component';

describe('Grfikon Management Component', () => {
  let comp: GrfikonComponent;
  let fixture: ComponentFixture<GrfikonComponent>;
  let service: GrfikonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GrfikonComponent],
    })
      .overrideTemplate(GrfikonComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrfikonComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GrfikonService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.grfikons?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
