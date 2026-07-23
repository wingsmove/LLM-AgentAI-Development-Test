export type ScoreCreate = {
  percent: string;
  points: string;
  time: string;
  percent_possible: string;
  division: string;
  shooter_class: string;
  power_factor: string;
  hits_a: number;
  hits_c: number;
  hits_d: number;
  misses_m: number;
  nopenaltymisses_npm: number;
  no_shoots: number;
  procedurals: number;
  additional_penalties_apen: number;
};

export type Score = ScoreCreate & {
  id: number;
  created_at: string;
};

export type ScoreFormValues = {
  [Field in keyof ScoreCreate]: string;
};
