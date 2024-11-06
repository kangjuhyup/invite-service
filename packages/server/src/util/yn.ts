export const YN = {
  Y: 'Y',
  N: 'N',
} as const;

export type YN = (typeof YN)[keyof typeof YN];

export const booleanToYN = (data: boolean): YN => {
  return data === true ? YN.Y : YN.N;
};
