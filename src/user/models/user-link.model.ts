export interface UserLinkModel {
  mapID: number;
  links: UserLink[];
}

export interface UserLink {
  UserID: number;
  Username: string;
  Admin: boolean;
  Selected: boolean;
}
