export type ClubCreate = {
  club_name: string;
  club_url: string;
};

export type Club = ClubCreate & {
  id: number;
};
