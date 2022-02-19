import GenderTypes from './gender.model';
import ImageModel from './image.model';

export default class ProfileModel {
  id?: number;
  profile_picture: ImageModel;
  profile_picURL: string;
  birth_date: string;
  gender: string;
  profile_email: string;
}
