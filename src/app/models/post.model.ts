import UserModel from './user.model';
import LikeModel from './like.model';
import ImageModel from './image.model';

export default class PostModel{
  id?: number;
  imageURL: string;
  content: string;
  user: UserModel;
  likes?: LikeModel[];
  created_at: string;
  updated_at: string;
  image: ImageModel;
}
