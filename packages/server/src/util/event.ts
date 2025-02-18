export const EventType = {
  SEND_VERIFY_CODE: 'SEND_VERIFY_CODE',
  VERIFIED_CODE: 'VERIFIED_CODE',
} as const;

export type EventType = typeof EventType[keyof typeof EventType];