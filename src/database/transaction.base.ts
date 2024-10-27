import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
/**
 * 트랜잭션에는 데이터베이스 CRUD 로직과 비즈니스 로직이 모두 포함된다.
 * 서비스 레이어와 데이터 레이어 사이에서 트랜잭션을 실행시키기 위한 추상 클래스
 * 이 클래스를 상속받아 필요한 트랜잭션을 작성한다.
 */

@Injectable()
export abstract class BaseTransaction<TransactionInput, TransactionOutput> {
  protected constructor(private readonly datasource: DataSource) {}

  protected abstract execute(
    data: TransactionInput,
    manager: EntityManager,
  ): Promise<TransactionOutput>;

  private async createRunner(): Promise<QueryRunner> {
    return this.datasource.createQueryRunner();
  }

  async run(data: TransactionInput): Promise<TransactionOutput> {
    const queryRunner = await this.createRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction('REPEATABLE READ'); // 격리수준 RPEATABLE READ

    try {
      const result = await this.execute(data, queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async runWithinTransaction(
    data: TransactionInput,
    manager: EntityManager,
  ): Promise<TransactionOutput> {
    return this.execute(data, manager);
  }
}
