import ProfileModel from './profile.model';
import PostModel from './post.model';
import UserModel from './user.model';

export default class LikeModel {
  id?: number;
  postId: number;
  userId: number;
  created_at: Date;
  updated_at: Date
  profile?: ProfileModel;
}
