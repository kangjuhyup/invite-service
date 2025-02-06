export const TemplateTotalColumn = {
    table: 'tb_vs_tmpl',
    templateId: 'tmpl_id',
    forkCount: 'frk_cnt',
    viewCount: 'vw_cnt',
  } as const;
  
  export type TemplateTotalColumn =
    (typeof TemplateTotalColumn)[keyof typeof TemplateTotalColumn];
  