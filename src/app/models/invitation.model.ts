import UserModel from './user.model';

export enum InvitationStatus {
  SENT = 1,
  ACCEPTED,
  REJECTED,
  CANCELED
}

export enum InvitationTypes {
  SENT,
  RECEIVED
}

export default class InvitationModel {
  id: number;
  to_user: UserModel;
  from_user: UserModel;
  status: InvitationStatus;
  is_read: boolean;
  created_at: string;
}
