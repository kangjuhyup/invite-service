import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { LetterAttachmentColumn } from "../column/letter.attachment.column";
import { MetadataColumn } from "../column/metadata.column";
import { TemplateColumn } from "../column/template.column";
import { LetterCategoryColumn } from "../column/letter.category.column";
import { LetterColumn } from "../column/letter.column";

export class TemplateTitleCategory1738839250212 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add columns to template table
        await queryRunner.addColumn(TemplateColumn.table,
            new TableColumn({
              name: TemplateColumn.title,
              type: 'varchar(100)',
              isNullable: false,
            })
        );
        await queryRunner.query(`ALTER TABLE ${TemplateColumn.table} MODIFY COLUMN ${TemplateColumn.title} varchar(100) AFTER ${TemplateColumn.userId}`);

        await queryRunner.addColumn(TemplateColumn.table,
            new TableColumn({
              name: LetterCategoryColumn.letterCategoryCode,
              type: 'char(5)',
              isNullable: false,
            })
        );
        await queryRunner.query(`ALTER TABLE ${TemplateColumn.table} MODIFY COLUMN ${LetterCategoryColumn.letterCategoryCode} char(5) AFTER ${TemplateColumn.title}`);

        // Add column to letter table
        await queryRunner.addColumn(LetterColumn.table,
            new TableColumn({
              name: LetterColumn.inviteDate,
              type: 'char(10)',
              isNullable: false,
            })
        );
        await queryRunner.query(`ALTER TABLE ${LetterColumn.table} MODIFY COLUMN ${LetterColumn.inviteDate} char(10) AFTER ${LetterColumn.body}`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(TemplateColumn.table, TemplateColumn.title);
        await queryRunner.dropColumn(TemplateColumn.table, LetterCategoryColumn.letterCategoryCode);
        await queryRunner.dropColumn(LetterColumn.table, LetterColumn.inviteDate);
    }

}
