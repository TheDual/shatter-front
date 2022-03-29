import UserModel from './user.model';
import PostModel from './post.model';

export enum ActionTypes {
  ADD_FRIEND = 1,
  ADD_POST,
  ADD_COMMENT,
  SHARE_POST
}

export default class ActivityModel {
  id?: number;
  user: UserModel;
  friend?: UserModel;
  post?: PostModel;
  action: ActionTypes;
  created_at: string;
  updated_at: string;
}
