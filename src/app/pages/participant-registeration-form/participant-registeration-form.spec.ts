import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { ParticipantService } from '@services/participant/participant-service';
import { Notification } from '@services/notification/notification';
import { ParticipantRegisterationForm } from './participant-registeration-form';

describe('ParticipantRegisterationForm', () => {
  let component: ParticipantRegisterationForm;
  let fixture: ComponentFixture<ParticipantRegisterationForm>;
  let participantService: {
    addParticipant: ReturnType<typeof vi.fn>;
    addLogo: ReturnType<typeof vi.fn>;
    updateParticipant: ReturnType<typeof vi.fn>;
    getParticipantById: ReturnType<typeof vi.fn>;
  };
  let notification: Notification;

  const route = {
    snapshot: {
      params: {},
      url: [{ path: '' }, { path: '' }],
    },
  };

  beforeEach(async () => {
    participantService = {
      addParticipant: vi.fn().mockReturnValue(
        of({ institution: { id: 7 } })
      ),
      addLogo: vi.fn().mockReturnValue(of(true)),
      updateParticipant: vi.fn().mockReturnValue(of(true)),
      getParticipantById: vi.fn().mockReturnValue(of(null)),
    };
    notification = new Notification();
    route.snapshot.params = {};
    route.snapshot.url = [{ path: '' }, { path: '' }];

    await TestBed.configureTestingModule({
      imports: [ParticipantRegisterationForm],
      providers: [
        provideRouter([]),
        { provide: ParticipantService, useValue: participantService },
        { provide: Notification, useValue: notification },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParticipantRegisterationForm);
    component = fixture.componentInstance;
    vi.spyOn(TestBed.inject(Router), 'navigate').mockImplementation(() => Promise.resolve(true));
    await fixture.whenStable();
  });

  function fillRequiredFields(): void {
    component.participantForm.patchValue({
      name: 'Alpha Bank',
      bic: 'ALPHETAA',
      email: 'alpha@example.com',
      shortName: 'Alpha',
      address: 'Addis Ababa',
      phoneNumber: '900000001',
    });
  }

  function createFile(name: string, type = 'image/png', size = 1): File {
    return new File([new Uint8Array(size)], name, { type });
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow the optional logo to be empty', () => {
    const logo = component.participantForm.get('logo');

    expect(logo?.value).toBeNull();
    expect(logo?.valid).toBe(true);
  });

  it('should reject non-image files', () => {
    const logo = component.participantForm.get('logo');

    logo?.setValue(createFile('document.pdf', 'application/pdf'));

    expect(logo?.hasError('invalidImageType')).toBe(true);
  });

  it('should reject images larger than 5 MB', () => {
    const logo = component.participantForm.get('logo');

    logo?.setValue(createFile('large.png', 'image/png', 5 * 1024 * 1024 + 1));

    expect(logo?.hasError('maxFileSize')).toBe(true);
  });

  it('should accept a valid image', () => {
    const logo = component.participantForm.get('logo');

    logo?.setValue(createFile('logo.png'));

    expect(logo?.valid).toBe(true);
  });

  it('should replace the previous logo when another image is selected', () => {
    const firstFile = createFile('first.png');
    const secondFile = createFile('second.png');

    component.onFileSelected({ target: { files: [firstFile] } });
    component.onFileSelected({ target: { files: [secondFile] } });

    expect(component.selectedFile).toBe(secondFile);
    expect(component.participantForm.get('logo')?.value).toBe(secondFile);
    expect(component.formData.get('logo')).toBe(secondFile);
  });

  it('should normalize non-numeric phone number input', () => {
    component.participantForm.get('phoneNumber')?.setValue('09a00-000-001');

    expect(component.participantForm.get('phoneNumber')?.value).toBe('0900000001');
  });

  it('should submit a new participant without uploading a logo', () => {
    const router = TestBed.inject(Router);
    fillRequiredFields();

    component.onSubmit();

    expect(participantService.addParticipant).toHaveBeenCalledWith({
      name: 'Alpha Bank',
      bic: 'ALPHETAA',
      shortName: 'Alpha',
      address: 'Addis Ababa',
      email: 'alpha@example.com',
      phoneNumber: '+251900000001',
      status: 'INACTIVE',
    });
    expect(participantService.addLogo).not.toHaveBeenCalled();
    expect(notification.type()).toBe('success');
    expect(notification.message()).toBe('New participant added successfully.');
    expect(router.navigate).toHaveBeenCalledWith(['/participants']);
  });

  it('should upload the selected logo after creating a participant', () => {
    const file = createFile('logo.png');
    fillRequiredFields();
    component.onFileSelected({ target: { files: [file] } });

    component.onSubmit();

    expect(participantService.addLogo).toHaveBeenCalledWith(7, component.formData);
  });

  it('should show the edit confirmation instead of submitting immediately', () => {
    component.isEditMode.set(true);

    component.onSubmit();

    expect(component.submitted()).toBe(true);
    expect(component.confirmEdit()).toBe(true);
    expect(participantService.updateParticipant).not.toHaveBeenCalled();
  });

  it('should submit edits without uploading a logo', () => {
    const router = TestBed.inject(Router);
    component.isEditMode.set(true);
    fillRequiredFields();

    component.executeEdit();

    expect(participantService.updateParticipant).toHaveBeenCalledWith(0, {
      name: 'Alpha Bank',
      bic: 'ALPHETAA',
      shortName: 'Alpha',
      address: 'Addis Ababa',
      email: 'alpha@example.com',
      phoneNumber: '+251900000001',
      status: 'INACTIVE',
    });
    expect(participantService.addLogo).not.toHaveBeenCalled();
    expect(notification.message()).toBe('Saved changes successfully.');
    expect(router.navigate).toHaveBeenCalledWith(['/participants']);
  });

  it('should cancel by navigating back to participants', () => {
    const router = TestBed.inject(Router);

    component.cancel();

    expect(router.navigate).toHaveBeenCalledWith(['/participants']);
  });
});
