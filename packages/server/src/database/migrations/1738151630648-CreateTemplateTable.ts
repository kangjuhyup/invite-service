import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { AttachmentColumn } from "../column/attachment.column";
import { DefaultColumn } from "../column/default";
import { TemplateAttachmentColumn } from "../column/template.attachment.column.";
import { TemplateColumn } from "../column/template.column";

export class CreateTemplateTable implements MigrationInterface {

    name = 'CreateTemplateTable1738151630648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Template 테이블 생성
        await queryRunner.createTable(
          new Table({
            name: TemplateColumn.table,
            columns: [
              {
                name: TemplateColumn.templateId,
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: TemplateColumn.userId,
                type: 'varchar',
                length: '100',
                isPrimary: true,
              },
              {
                name: DefaultColumn.useYn,
                type: 'char',
                length: '1',
                default: "'Y'",
                isNullable: false,  
              },
              {
                name: DefaultColumn.creator,
                type: 'varchar',
                length: '100',
                isNullable: false,
              },
              {
                name: DefaultColumn.createdAt,
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                isNullable: false,
              },
              {
                name: DefaultColumn.updator,
                type: 'varchar',
                length: '100',
                isNullable: false,
              },
              {
                name: DefaultColumn.updatedAt,
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
                isNullable: false,
              },
            ],
          }),
          true,
        );
    
        // TemplateAttachment 테이블 생성
        await queryRunner.createTable(
          new Table({
            name: TemplateAttachmentColumn.table,
            columns: [
              {
                name: TemplateColumn.templateId,
                type: 'int',
                isPrimary: true,
              },
              {
                name: TemplateAttachmentColumn.attachmentCode,
                type: 'char',
                length: '5',
                isNullable: false,
              },
              {
                name: AttachmentColumn.attachmentId,
                type: 'int',
                isPrimary: true,
              },
              {
                name: DefaultColumn.useYn,
                type: 'char',
                length: '1',
                default: "'Y'",
                isNullable: false,
              },
              {
                name: DefaultColumn.creator,
                type: 'varchar',
                length: '100',
                isNullable: false,
              },
              {
                name: DefaultColumn.createdAt,
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                isNullable: false,
              },
              {
                name: DefaultColumn.updator,
                type: 'varchar',
                length: '100',
                isNullable: false,
              },
              {
                name: DefaultColumn.updatedAt,
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
                isNullable: false,
              },
            ],
          }),
          true,
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(TemplateAttachmentColumn.table);
        await queryRunner.dropTable(TemplateColumn.table);
      }
}
