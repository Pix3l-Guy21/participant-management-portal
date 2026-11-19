import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ParticipantService } from '@services/participant/participant-service';
import { Notification } from '@services/notification/notification';
import { Participants } from '@interfaces/participants';
import { Participantspage } from './participantspage';

describe('Participantspage', () => {
  let component: Participantspage;
  let fixture: ComponentFixture<Participantspage>;
  let participantService: {
    getParticipants: ReturnType<typeof vi.fn>;
    deleteParticipantById: ReturnType<typeof vi.fn>;
  };
  let notification: Notification;
  const participants: Participants[] = [
    {
      id: 1,
      name: 'Alpha Bank',
      bic: 'ALPHETAA',
      shortName: 'Alpha',
      address: 'Addis Ababa',
      email: 'alpha@example.com',
      phoneNumber: '+251900000001',
      logoPath: null,
      status: 'ACTIVE',
    },
    {
      id: 2,
      name: 'Beta Bank',
      bic: 'BET HETAA'.replace(' ', ''),
      shortName: 'Beta',
      address: 'Addis Ababa',
      email: 'beta@example.com',
      phoneNumber: '+251900000002',
      logoPath: null,
      status: 'INACTIVE',
    },
  ];

  beforeEach(async () => {
    participantService = {
      getParticipants: vi.fn().mockReturnValue(of(participants)),
      deleteParticipantById: vi.fn().mockReturnValue(of(true)),
    };
    notification = new Notification();

    await TestBed.configureTestingModule({
      imports: [Participantspage],
      providers: [
        provideRouter([]),
        { provide: ParticipantService, useValue: participantService },
        { provide: Notification, useValue: notification },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Participantspage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load participants and stop loading', () => {
    expect(participantService.getParticipants).toHaveBeenCalled();
    expect(component.banks()).toEqual(participants);
    expect(component.isLoading()).toBe(false);
    expect(component.loadingError()).toBe('');
  });

  it('should expose a loading error and stop loading when loading fails', () => {
    participantService.getParticipants.mockReturnValue(
      throwError(() => new Error('Request failed'))
    );

    component.isLoading.set(true);
    component.loadParticipants();

    expect(component.loadingError()).toBe('Failed to load data.');
    expect(component.isLoading()).toBe(false);
  });

  it('should filter participants by name or status', () => {
    component.banks.set(participants);

    component.filterResults('alpha');
    expect(component.filteredBanks()).toEqual([participants[0]]);

    component.filterResults('inactive');
    expect(component.filteredBanks()).toEqual([participants[1]]);
  });

  it('should show and cancel the logout confirmation', () => {
    component.confirmLogout();
    expect(component.checkLogout()).toBe(true);

    component.cancelLogout();
    expect(component.checkLogout()).toBe(false);
  });

  it('should navigate to login when logout is confirmed', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.executeLogout();

    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show and cancel the delete confirmation', () => {
    component.confirmDelete(1);
    expect(component.participantToDelete()).toBe(1);
    expect(component.successMessage()).toBeNull();
    expect(component.errorMessage()).toBeNull();

    component.cancelDelete();
    expect(component.participantToDelete()).toBeNull();
  });

  it('should not delete when no participant is selected', () => {
    component.executeDelete();

    expect(participantService.deleteParticipantById).not.toHaveBeenCalled();
  });

  it('should delete the selected participant and show a success banner', () => {
    const loadParticipants = vi.spyOn(component, 'loadParticipants');
    component.confirmDelete(1);

    component.executeDelete();

    expect(participantService.deleteParticipantById).toHaveBeenCalledWith(1);
    expect(component.participantToDelete()).toBeNull();
    expect(component.successMessage()).toBe('Record deleted successfully');
    expect(notification.type()).toBe('error');
    expect(notification.message()).toBe('Participant Deleted.');
    expect(loadParticipants).toHaveBeenCalled();
  });
});
