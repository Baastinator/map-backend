export interface UserModel {
  ID: number;
  Username: string;
  Passhash: string;
  Admin: 0 | 1;
}
