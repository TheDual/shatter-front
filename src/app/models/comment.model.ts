import ProfileModel from './profile.model';
import PostModel from './post.model';
import UserModel from './user.model';
import { VoteState } from '../constants/constants';

export default class CommentModel {
  id?: number;
  postId: number;
  userId: number;
  created_at: string;
  updated_at: string
  content: string;
  user: UserModel;

  voteValue: number = 0;
  voteState: VoteState = VoteState.DEFAULT;
}
