export const DefaultColumn = {
  useYn: 'use_yn',
  creator: 'creator',
  createdAt: 'created_at',
  updator: 'updator',
  updatedAt: 'updated_at',
} as const;

export type DefaultColumn = (typeof DefaultColumn)[keyof typeof DefaultColumn];
