jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ItemService } from '../service/item.service';
import { IItem, Item } from '../item.model';

import { ItemUpdateComponent } from './item-update.component';

describe('Component Tests', () => {
  describe('Item Management Update Component', () => {
    let comp: ItemUpdateComponent;
    let fixture: ComponentFixture<ItemUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let itemService: ItemService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ItemUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ItemUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ItemUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      itemService = TestBed.inject(ItemService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const item: IItem = { id: 456 };

        activatedRoute.data = of({ item });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(item));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const item = { id: 123 };
        spyOn(itemService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ item });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: item }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(itemService.update).toHaveBeenCalledWith(item);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const item = new Item();
        spyOn(itemService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ item });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: item }));
        saveSubject.complete();

        // THEN
        expect(itemService.create).toHaveBeenCalledWith(item);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const item = { id: 123 };
        spyOn(itemService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ item });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(itemService.update).toHaveBeenCalledWith(item);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
