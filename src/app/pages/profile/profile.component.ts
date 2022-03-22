import { Component, OnDestroy, OnInit } from '@angular/core';
import UserModel from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileDataModalComponent } from '../../widgets/edit-profile-data-modal/edit-profile-data-modal.component';
import { EnumsService } from '../../services/enums.service';
import { DATE_CONSTRAINTS, SCREENS } from '../../constants/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { catchError, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import PostModel from '../../models/post.model';
import { NotificationsService } from '../../services/notifiactions.service';
import { InvitationStatus } from '../../models/invitation.model';

export enum Views {
  GRID,
  LIST
}

export enum Tabs {
  FRIENDS,
  POSTS,
  ACTIVITY
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  id: number | null;
  currentUser: UserModel | null;
  userData: UserModel | null;
  genderTypes: any;
  invitationStatus = InvitationStatus;
  Tabs = Tabs;
  Views = Views;

  view = Views.GRID;
  tab = Tabs.FRIENDS;
  SCREENS = SCREENS;

  constructor(private authService: AuthService,
              private modalService: NgbModal,
              private enumsService: EnumsService,
              private router: Router,
              private route: ActivatedRoute,
              private usersService: UsersService,
              private toastrService: ToastrService,
              private notificationsService: NotificationsService) {
    this.genderTypes = this.enumsService.getObject(['gender']);

    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(val => {
        this.id = +this.route.snapshot.params['id'];
        const queryParams: any = this.route.snapshot.queryParams;

        this.view = +queryParams['view'] || Views.GRID;
        this.tab = +queryParams['tab'] || Tabs.FRIENDS;


        this.authService.user.subscribe(data => {
          if (data) {
            this.currentUser = data;
            this.loadUserData();
          }
        });
      })

  }

  ngOnInit(): void {
  }

  loadUserData() {
    if (!this.id && !this.currentUser) return;
    const userId = this.id || this.currentUser!.id!;

    this.usersService.getDetail<UserModel>(userId)
      .pipe(takeUntil(this.unsubscribe$),
        switchMap((data: UserModel) => {
          return this.usersService.getUserPosts(userId).pipe(map(posts => {return {...data, posts: posts}}))
        }),
        switchMap((data: UserModel) => {
          return this.usersService.getUserFriends(userId).pipe(map(friends => { return {...data, friends: friends}}))
        }),
        switchMap((data: UserModel) => {
          if (data.id === this.currentUser!.id) return of(data);

          return this.notificationsService.loadInvitationsBetweenUsers(userId, {status__in: [1]}).pipe(map(invitations => { return {...data, ...invitations }}))
        }),
        map(data => {
          if (data.friends?.length && data.id !== this.currentUser!.id) {
            data.is_friend = data.friends.some(friend => friend.id === this.currentUser!.id);
          }
          return data;
        }),
        catchError((err: any, caught: any) => {
          throw err;
        })
      )
      .subscribe({
        next: data => {
          this.userData = data;
          console.log(data);
        },
        error: err => {
          console.log(err);
          this.toastrService.error(err?.error?.message || 'Could not load user data');
        }
      })
  }

  openEditProfileDataModal() {
    const modalRef = this.modalService.open(EditProfileDataModalComponent, {size: 'lg'});
    modalRef.componentInstance.user = this.currentUser;
    modalRef.result.then(res => {

    }, error => {

    })

  }

  changeView(viewType: Views) {
    if (this.view === viewType) return;
    this.view = viewType;

    this.updateQueryParams({view: this.view})
  }

  changeTab(tabType: Tabs) {
    if (this.tab === tabType) return;
    this.tab = tabType;

    this.updateQueryParams({tab: this.tab})
  }

  updateQueryParams(params: any) {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: params,
        queryParamsHandling: 'merge'
      });
  }

  seeAll(tab: Tabs) {
    this.view = Views.LIST;
    this.tab = tab;

    this.updateQueryParams({tab: this.tab, view: this.view});
  }

  goToUserProfile(friendId: number | undefined) {
    if (!friendId) return;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([SCREENS.PROFILE, friendId], {
      skipLocationChange: false
    })
  }

  addFriend(receivedRequest = false) {
    if (this.userData?.is_friend) return;

    this.notificationsService.createInvitation({to_user: this.userData!.id!})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: value => {
          this.toastrService.success(`Friend request has been ${receivedRequest ? 'accepted' : 'sent'}!`)
          this.loadUserData();
        },
        error: err => {
          console.log(err);
          this.toastrService.error(err?.error?.message || 'Could remove user from friends');
        }
      })
  }

  removeFriend() {
    if (!this.userData?.is_friend) return;

    this.usersService.removeFriend(this.userData.id!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: value => {
          this.toastrService.success('User has been removed from your friend list!')
          this.loadUserData();
        },
        error: err => {
          console.log(err);
          this.toastrService.error(err?.error?.message || 'Could remove user from friends');
        }
      })
  }

  handleInvitation(invitationId: number | undefined, invitationStatus: InvitationStatus) {
    if (!invitationId) return;

    const payload = {
      invitation_id: invitationId,
      status: invitationStatus
    }

    this.notificationsService.handleInvitation(payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: value => {
          this.toastrService.success(`Invitation has been ${InvitationStatus[invitationStatus].toLowerCase()}`)
          this.loadUserData()
        },
        error: err => {
          this.toastrService.error(err?.error?.message || 'Could not perform action');
          console.log(err);
        }
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
