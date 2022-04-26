import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatsService } from '../../services/chats.service';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';
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
  @ViewChild('chatsRef') chatsRef: ElementRef;
  unsubscribe$ = new Subject<void>();
  user: UserModel;
  chats: {id: number, friend: UserModel, highlighted?: boolean}[] = []
  isSelectingFriend = false;
  resize$;
  numberOfChats = 4;

  constructor(private chatsService: ChatsService,
              private authService: AuthService,
              private toastrService: ToastrService,
              private usersService: UsersService) {
    this.resize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(500))
      .subscribe(e => {
        this.checkElementWidth();
      })
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.loadUserFriends();
      }
    })
    this.checkElementWidth();
  }

  addChat(recipientId: number) {
    let findChat = this.chats.find(chat => chat.friend.id === recipientId);
    if (findChat) {
      findChat.highlighted = true;

      setTimeout(() => {
        findChat!.highlighted = false;
      }, 2000);
      return;
    }

    if (this.chats.length === this.numberOfChats) {
      this.chats.shift();
    }

    this.chatsService.getChat({recipientId: recipientId})
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: chat => {
          const chatPayload = {
            id: chat.id!,
            friend: this.user.id === chat.user1.id ? chat.user2 : chat.user1
          };

          this.isSelectingFriend = false;
          this.chats.unshift(chatPayload);
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

  checkElementWidth() {
    const elWidth = window.innerWidth;

    if (elWidth >= 1600) this.numberOfChats = 4;
    if (elWidth < 1600) this.numberOfChats = 3;
    if (elWidth < 1300) this.numberOfChats = 2;
    if (elWidth < 1000) this.numberOfChats = 1;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.resize$ && this.resize$.unsubscribe();
  }
}
