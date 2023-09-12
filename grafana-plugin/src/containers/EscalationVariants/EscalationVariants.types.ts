export enum EscalationVariantsTab {
  Schedules,
  Escalations,
  Users,
}

export interface UserAvailability {
  warnings: any[];
}

export enum ResponderType {
  User,
  Schedule,
  // EscalationChain, // for future
}
