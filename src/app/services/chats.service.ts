import { Injectable, Injector } from '@angular/core';
import { BaseModelService } from './base-model.service';
import { io, Socket } from 'socket.io-client';
import enviroment from '../enviroment';
import { AuthService } from './auth.service';
import UserModel from '../models/user.model';
import { Observable } from 'rxjs';
import MessageModel from '../models/message.model';
import ChatModel from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatsService extends BaseModelService {
  socket: Socket;
  user: UserModel;

  constructor(private inj: Injector,
              private authService: AuthService) {
    super(inj, '')

    this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.socket = io(enviroment.apiChatUrl);
      }
    })
  }

  sendMessage(chatId: number, content: string) {
    this.socket?.emit('send-message', {
      chat: chatId,
      senderId: this.user?.id,
      content: content
    })
  }

  joinChat(chatId: number) {
    this.socket?.emit('join-chat', chatId);
  }

  getChat(chatData: {recipientId: number}): Observable<ChatModel> {
    return this.http.post<ChatModel>(enviroment.apiUrl + 'chats/', chatData);
  }

  getChatMessages(chatId: number): Observable<MessageModel[]> {
    return this.http.get<MessageModel[]>(enviroment.apiUrl + `chats/${chatId}/messages`);
  }

}
