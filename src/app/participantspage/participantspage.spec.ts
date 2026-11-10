import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Participantspage } from './participantspage';

describe('Participantspage', () => {
  let component: Participantspage;
  let fixture: ComponentFixture<Participantspage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Participantspage],
    }).compileComponents();

    fixture = TestBed.createComponent(Participantspage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
