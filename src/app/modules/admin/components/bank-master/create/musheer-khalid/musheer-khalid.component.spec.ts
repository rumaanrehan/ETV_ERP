import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusheerKhalidComponent } from './musheer-khalid.component';

describe('MusheerKhalidComponent', () => {
  let component: MusheerKhalidComponent;
  let fixture: ComponentFixture<MusheerKhalidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusheerKhalidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusheerKhalidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
