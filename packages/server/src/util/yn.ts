export const YN = {
  Y: 'Y',
  N: 'N',
} as const;

export type YN = (typeof YN)[keyof typeof YN];

export const booleanToYN = (data: boolean): YN => {
  if (data === undefined || data === null) return;
  return data === true ? YN.Y : YN.N;
};

export const ynToBoolean = (data: YN): boolean => {
  return data === YN.Y;
};
