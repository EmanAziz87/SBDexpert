export interface LiftInfo {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface DayDetail {
  [key: string]: LiftDayDetails;
}

export interface LiftDayDetails {
  lifts: Array<string>;
}

export interface ProgramDetails {
  week: number;
  days: {
    [key: string]: LiftDayDetails;
  };
}

export interface AdditionalInputs {
  [key: string]: {
    [key: string]: Array<string>;
  };
}

export interface ProgramScaffold {
  weeks: number;
  weeklyFrequency: number;
}
