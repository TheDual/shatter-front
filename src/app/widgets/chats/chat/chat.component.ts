import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { ChatsService } from '../../../services/chats.service';
import MessageModel from '../../../models/message.model';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import UserModel from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { SCREENS } from '../../../constants/constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messageBody') messageBody: ElementRef;
  @ViewChild('chatBody') chatBody: ElementRef;
  @Input() user: UserModel
  @Input() chat: {id: number, friend: UserModel, highlighted?: boolean};
  @Output() onCloseChat = new EventEmitter<number>();


  unsubscribe$ = new Subject<void>();
  messages: MessageModel[] = [];
  SCREENS = SCREENS;
  chatScrollHeight: number = 0;
  isMinimized = false;

  constructor(private chatsService: ChatsService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    if (this.chat?.id) {
      this.chatsService.joinChat(this.chat.id);

      this.chatsService.socket?.on('receive-message', (message: MessageModel) => {
        if (message?.chat === this.chat.id) {
          this.chat.highlighted = true;
          setTimeout(() => {
            this.chat.highlighted = false;
          }, 2000);

          this.mapMessageDate(message);
          this.messages.push(message);
          this.scrollToBottom();
        }
      })

      this.chatsService.getChatMessages(this.chat.id)
        .pipe(takeUntil(this.unsubscribe$),
              map(messages => {
                if (messages?.length) {
                  messages.forEach(message => this.mapMessageDate(message))
                }
                return messages;
              }))
        .subscribe({
          next: messages => {
            this.messages = messages;
            this.scrollToBottom();
          },
          error: err => {
            this.toastrService.error(err?.error?.message || 'Could not load chat messages');
            console.log(err);
          }
        })
    }
  }


  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBody) {
        this.chatScrollHeight = this.chatBody.nativeElement.scrollHeight;
      }
    })
  }

  sendMessage() {
    const value = this.messageBody?.nativeElement?.textContent;

    if (!value) return;

    this.chatsService.sendMessage(this.chat?.id, value);
    this.messageBody.nativeElement.textContent = '';
  }

  closeChat() {
    this.onCloseChat.emit(this.chat?.id);
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  mapMessageDate(message: MessageModel) {
    message['created_at'] =  moment(message['created_at']).local().format('YYYY-MM-DD HH:mm');
  }
}
