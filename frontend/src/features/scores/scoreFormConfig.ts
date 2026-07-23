import type { HTMLInputTypeAttribute } from "react";
import type { ScoreCreate, ScoreFormValues } from "./types";

type ScoreField = {
  name: keyof ScoreFormValues;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
};

export const EMPTY_SCORE_FORM: ScoreFormValues = {
  percent: "",
  points: "",
  time: "",
  percent_possible: "",
  division: "CO",
  shooter_class: "C",
  power_factor: "MINOR",
  hits_a: "0",
  hits_c: "0",
  hits_d: "0",
  misses_m: "0",
  nopenaltymisses_npm: "0",
  no_shoots: "0",
  procedurals: "0",
  additional_penalties_apen: "0",
};

export const SCORE_FIELDS: ScoreField[] = [
  { name: "percent", label: "%", placeholder: "48.32%" },
  { name: "points", label: "Pts", placeholder: "289.1217" },
  { name: "time", label: "Time", placeholder: "196.59" },
  {
    name: "percent_possible",
    label: "% psbl",
    placeholder: "42.30%",
  },
  { name: "division", label: "Div" },
  { name: "shooter_class", label: "Class" },
  { name: "power_factor", label: "PF" },
  { name: "hits_a", label: "A", type: "number" },
  { name: "hits_c", label: "C", type: "number" },
  { name: "hits_d", label: "D", type: "number" },
  { name: "misses_m", label: "M", type: "number" },
  { name: "nopenaltymisses_npm", label: "NPM", type: "number" },
  { name: "no_shoots", label: "NS", type: "number" },
  { name: "procedurals", label: "Proc", type: "number" },
  {
    name: "additional_penalties_apen",
    label: "APen",
    type: "number",
  },
];

export function toScoreCreate(form: ScoreFormValues): ScoreCreate {
  return {
    ...form,
    hits_a: Number(form.hits_a),
    hits_c: Number(form.hits_c),
    hits_d: Number(form.hits_d),
    misses_m: Number(form.misses_m),
    nopenaltymisses_npm: Number(form.nopenaltymisses_npm),
    no_shoots: Number(form.no_shoots),
    procedurals: Number(form.procedurals),
    additional_penalties_apen: Number(form.additional_penalties_apen),
  };
}
