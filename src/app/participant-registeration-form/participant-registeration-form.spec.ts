import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticipantRegisterationForm } from './participant-registeration-form';

describe('ParticipantRegisterationForm', () => {
  let component: ParticipantRegisterationForm;
  let fixture: ComponentFixture<ParticipantRegisterationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantRegisterationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantRegisterationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
