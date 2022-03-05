import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGrfikon, Grfikon } from '../grfikon.model';

import { GrfikonService } from './grfikon.service';

describe('Grfikon Service', () => {
  let service: GrfikonService;
  let httpMock: HttpTestingController;
  let elemDefault: IGrfikon;
  let expectedResult: IGrfikon | IGrfikon[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrfikonService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      region: 'AAAAAAA',
      promet: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Grfikon', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Grfikon()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Grfikon', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          region: 'BBBBBB',
          promet: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Grfikon', () => {
      const patchObject = Object.assign(
        {
          region: 'BBBBBB',
          promet: 1,
        },
        new Grfikon()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Grfikon', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          region: 'BBBBBB',
          promet: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Grfikon', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGrfikonToCollectionIfMissing', () => {
      it('should add a Grfikon to an empty array', () => {
        const grfikon: IGrfikon = { id: 123 };
        expectedResult = service.addGrfikonToCollectionIfMissing([], grfikon);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grfikon);
      });

      it('should not add a Grfikon to an array that contains it', () => {
        const grfikon: IGrfikon = { id: 123 };
        const grfikonCollection: IGrfikon[] = [
          {
            ...grfikon,
          },
          { id: 456 },
        ];
        expectedResult = service.addGrfikonToCollectionIfMissing(grfikonCollection, grfikon);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Grfikon to an array that doesn't contain it", () => {
        const grfikon: IGrfikon = { id: 123 };
        const grfikonCollection: IGrfikon[] = [{ id: 456 }];
        expectedResult = service.addGrfikonToCollectionIfMissing(grfikonCollection, grfikon);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grfikon);
      });

      it('should add only unique Grfikon to an array', () => {
        const grfikonArray: IGrfikon[] = [{ id: 123 }, { id: 456 }, { id: 86982 }];
        const grfikonCollection: IGrfikon[] = [{ id: 123 }];
        expectedResult = service.addGrfikonToCollectionIfMissing(grfikonCollection, ...grfikonArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grfikon: IGrfikon = { id: 123 };
        const grfikon2: IGrfikon = { id: 456 };
        expectedResult = service.addGrfikonToCollectionIfMissing([], grfikon, grfikon2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grfikon);
        expect(expectedResult).toContain(grfikon2);
      });

      it('should accept null and undefined values', () => {
        const grfikon: IGrfikon = { id: 123 };
        expectedResult = service.addGrfikonToCollectionIfMissing([], null, grfikon, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grfikon);
      });

      it('should return initial array if no Grfikon is added', () => {
        const grfikonCollection: IGrfikon[] = [{ id: 123 }];
        expectedResult = service.addGrfikonToCollectionIfMissing(grfikonCollection, undefined, null);
        expect(expectedResult).toEqual(grfikonCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
