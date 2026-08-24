import { ALL_SPECS } from "@/constants/constants";
import type { StudentVisit } from "@/types";
import { removeGroupPostfix } from "./removeGroupPostfix";

type Options = {
  visits: StudentVisit[];
  spec: string;
  since: Date | null;
};

export const filterVisits = ({ visits, spec, since }: Options): StudentVisit[] =>
  visits.filter((visit) => {
    if (since && new Date(visit.date_visit) <= since) {
      return false;
    }

    return spec === ALL_SPECS || removeGroupPostfix(visit.spec_name) === spec;
  });
