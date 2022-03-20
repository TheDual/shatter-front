import ProfileModel from './profile.model';
import LikeModel from './like.model';
import PostModel from './post.model';

export default class UserModel {
  id?: number;
  first_name: string = '';
  last_name: string = '';
  email: string;
  created_at: Date;
  updated_at: Date
  profile?: ProfileModel;
  likes: LikeModel[];
  friends: UserModel[];
  posts: PostModel[]

}
