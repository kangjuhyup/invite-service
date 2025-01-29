export const MetadataColumn = {
  table: 'tb_vm_mdta',
  angle: 'ang',
  width: 'w',
  height: 'h',
  x: 'x',
  y: 'y',
  z: 'z',
  font: 'font',
  color: 'clr',
  bold: 'bld',
} as const;

export type MetadataColumn =
  (typeof MetadataColumn)[keyof typeof MetadataColumn];
