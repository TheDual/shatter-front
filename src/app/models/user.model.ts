import ProfileModel from './profile.model';

export default class UserModel {
  id?: number;
  first_name: string = '';
  last_name: string = '';
  email: string;
  created_at: Date;
  updated_at: Date
  profile?: ProfileModel;

}
