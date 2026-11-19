import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ParticipantRegisterationForm } from './participant-registeration-form';

describe('ParticipantRegisterationForm', () => {
  let component: ParticipantRegisterationForm;
  let fixture: ComponentFixture<ParticipantRegisterationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantRegisterationForm],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {}, url: [{ path: '' }, { path: '' }] } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantRegisterationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow the optional logo to be empty', () => {
    expect(component.participantForm.get('logo')?.valid).toBe(true);
    expect(component.participantForm.get('logo')?.value).toBeNull();
  });
});
