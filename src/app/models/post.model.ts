import UserModel from './user.model';
import LikeModel from './like.model';

export default class PostModel {
  id?: number;
  image: Blob;
  last_name: string;
  created_at: Date;
  updated_at: Date;
  user: UserModel;
  likes: LikeModel[]
}
