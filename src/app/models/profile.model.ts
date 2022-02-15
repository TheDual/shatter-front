import GenderTypes from './gender.model';

export default class ProfileModel {
  id?: number;
  profile_pic: Blob;
  birth_date: Date;
  gender: GenderTypes;
  email: string;
}
