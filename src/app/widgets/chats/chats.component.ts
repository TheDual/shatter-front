import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatsService } from '../../services/chats.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import UserModel from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  user: UserModel;
  chats: {id: number, friend: UserModel}[] = []
  isSelectingFriend = false;

  constructor(private chatsService: ChatsService,
              private authService: AuthService,
              private toastrService: ToastrService,
              private usersService: UsersService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadUserFriends();
      }
    })
  }

  addChat(recipientId: number) {
    this.chatsService.getChat({recipientId: recipientId})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: chat => {
          const chatPayload = {
            id: chat.id!,
            friend: this.user.id === chat.user1.id ? chat.user2 : chat.user1
          };

          this.isSelectingFriend = false;
          this.chats.push(chatPayload);
        },
        error: err => {
          this.toastrService.error(err?.error?.message || 'Could not get chat');
          console.log(err);
        }
      })
  }

  closeChat(chatId: number) {
    const findChatIndex = this.chats.findIndex(chat => chat.id === chatId);

    if (findChatIndex > -1) {
      this.chats.splice(findChatIndex, 1);
    }
  }

  toggleIsSelecting() {
    this.isSelectingFriend = !this.isSelectingFriend;
  }

  loadUserFriends() {
    this.usersService.getUserFriends(this.user.id!)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: friends => {
          this.user.friends = friends;
        },
        error: err => {
          this.toastrService.error(err?.error?.message || 'Could not load friends');
          this.user.friends = [];
          console.log(err);
        }
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
