import GenderTypes from './gender.model';
import ImageModel from './image.model';

export default class ProfileModel {
  id?: number;
  image?: ImageModel;
  birth_date: string;
  gender: string;
  profile_email: string;
}
