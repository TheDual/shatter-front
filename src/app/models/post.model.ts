import UserModel from './user.model';
import LikeModel from './like.model';
import ImageModel from './image.model';
import CommentModel from './comment.model';

export default class PostModel{
  id?: number;
  imageURL: string;
  content: string;
  user: UserModel;
  likes: LikeModel[] = [];
  comments: CommentModel[] = [];
  created_at: string;
  updated_at: string;
  image?: ImageModel;
}
