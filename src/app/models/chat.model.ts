import UserModel from './user.model';
import { VoteState } from '../constants/constants';
import MessageModel from './message.model';

export default class ChatModel {
  id?: number;
  user1: UserModel;
  user2: UserModel;
  messages: MessageModel[];
  created_at: string;
  updated_at: string;
}
