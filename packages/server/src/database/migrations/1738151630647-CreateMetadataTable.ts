import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { MetadataColumn } from '../column/metadata.column';
import { AttachmentColumn } from '../column/attachment.column';
import { DefaultColumn } from '../column/default';
import { LetterAttachmentColumn } from '../column/letter.attachment.column';

export class CreateMetadataTable implements MigrationInterface {
  name = 'CreateMetadataTable1738151630647';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 메타데이터 테이블 생성
    await queryRunner.createTable(
      new Table({
        name: MetadataColumn.table,
        columns: [
          {
            name: AttachmentColumn.attachmentId,
            type: 'int',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: MetadataColumn.angle,
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: MetadataColumn.width,
            type: 'int',
            isNullable: false,
          },
          {
            name: MetadataColumn.height,
            type: 'int',
            isNullable: false,
          },
          {
            name: MetadataColumn.x,
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: MetadataColumn.y,
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: MetadataColumn.z,
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: MetadataColumn.font,
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: MetadataColumn.color,
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: MetadataColumn.bold,
            type: 'boolean',
            isNullable: true,
          },
          {
            name: DefaultColumn.creator,
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: DefaultColumn.useYn,
            type: 'char',
            length: '1',
            default: "'Y'",
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

    // 기존 데이터 마이그레이션
    await queryRunner.query(`
      INSERT INTO ${MetadataColumn.table} (
        ${AttachmentColumn.attachmentId},
        ${MetadataColumn.angle},
        ${MetadataColumn.width},
        ${MetadataColumn.height},
        ${MetadataColumn.x},
        ${MetadataColumn.y},
        ${MetadataColumn.z},
        ${MetadataColumn.font},
        ${MetadataColumn.bold},
        ${MetadataColumn.color},
        ${DefaultColumn.useYn},
        ${DefaultColumn.creator},
        ${DefaultColumn.updator}
      )
      SELECT 
        a.${AttachmentColumn.attachmentId},
        COALESCE(la.${MetadataColumn.angle}, 0),
        COALESCE(la.${MetadataColumn.width}, 0),
        COALESCE(la.${MetadataColumn.height}, 0),
        COALESCE(la.${MetadataColumn.x}, 0),
        COALESCE(la.${MetadataColumn.y}, 0),
        COALESCE(la.${MetadataColumn.z}, 0),
        la.${MetadataColumn.font},
        la.${MetadataColumn.bold},
        la.${MetadataColumn.color},
        a.${DefaultColumn.useYn},
        a.${DefaultColumn.creator},
        a.${DefaultColumn.updator}
      FROM ${AttachmentColumn.table} a
      LEFT JOIN ${LetterAttachmentColumn.table} la ON a.${AttachmentColumn.attachmentId} = la.${AttachmentColumn.attachmentId}
    `);

    // LetterAttachment 테이블에서 메타데이터 컬럼 제거
    await queryRunner.dropColumn(LetterAttachmentColumn.table, MetadataColumn.angle);
    await queryRunner.dropColumn(LetterAttachmentColumn.table, MetadataColumn.width);
    await queryRunner.dropColumn(LetterAttachmentColumn.table, MetadataColumn.height);
    await queryRunner.dropColumn(LetterAttachmentColumn.table, MetadataColumn.x);
    await queryRunner.dropColumn(LetterAttachmentColumn.table, MetadataColumn.y);
    await queryRunner.dropColumn(LetterAttachmentColumn.table, MetadataColumn.z);
    await queryRunner.dropColumn(LetterAttachmentColumn.table, MetadataColumn.font);
    await queryRunner.dropColumn(LetterAttachmentColumn.table, MetadataColumn.bold);
    await queryRunner.dropColumn(LetterAttachmentColumn.table, MetadataColumn.color);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // LetterAttachment 테이블에 메타데이터 컬럼 복구
    await queryRunner.addColumns(LetterAttachmentColumn.table, [
      new TableColumn({
        name: MetadataColumn.angle,
        type: 'int',
        isNullable: false,
        default: 0,
      }),
      new TableColumn({
        name: MetadataColumn.width,
        type: 'int',
        isNullable: false,
      }),
      new TableColumn({
        name: MetadataColumn.height,
        type: 'int',
        isNullable: false,
      }),
      new TableColumn({
        name: MetadataColumn.x,
        type: 'int',
        isNullable: false,
        default: 0,
      }),
      new TableColumn({
        name: MetadataColumn.y,
        type: 'int',
        isNullable: false,
        default: 0,
      }),
      new TableColumn({
        name: MetadataColumn.z,
        type: 'int',
        isNullable: false,
        default: 0,
      }),
      new TableColumn({
        name: MetadataColumn.font,
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
      new TableColumn({
        name: MetadataColumn.bold,
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: MetadataColumn.color,
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    ]);

    // 메타데이터 테이블의 데이터를 LetterAttachment 테이블로 복구
    await queryRunner.query(`
      UPDATE ${LetterAttachmentColumn.table} la
      INNER JOIN ${MetadataColumn.table} m ON la.${AttachmentColumn.attachmentId} = m.${AttachmentColumn.attachmentId}
      SET 
        la.${MetadataColumn.angle} = m.${MetadataColumn.angle},
        la.${MetadataColumn.width} = m.${MetadataColumn.width},
        la.${MetadataColumn.height} = m.${MetadataColumn.height},
        la.${MetadataColumn.x} = m.${MetadataColumn.x},
        la.${MetadataColumn.y} = m.${MetadataColumn.y},
        la.${MetadataColumn.z} = m.${MetadataColumn.z},
        la.${MetadataColumn.font} = m.${MetadataColumn.font},
        la.${MetadataColumn.bold} = m.${MetadataColumn.bold},
        la.${MetadataColumn.color} = m.${MetadataColumn.color}
      WHERE la.${AttachmentColumn.attachmentId} = m.${AttachmentColumn.attachmentId};
    `);

    // 메타데이터 테이블 삭제
    await queryRunner.dropTable(MetadataColumn.table);
  }
}
