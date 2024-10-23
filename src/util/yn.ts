export const YN = {
  Y: 'Y',
  N: 'N',
} as const;

export type YN = (typeof YN)[keyof typeof YN];
