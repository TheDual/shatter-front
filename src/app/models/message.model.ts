import UserModel from './user.model';
import { VoteState } from '../constants/constants';

export default class MessageModel {
  id?: number;
  senderId: number;
  chat: number;
  created_at: string;
  content: string;
}
