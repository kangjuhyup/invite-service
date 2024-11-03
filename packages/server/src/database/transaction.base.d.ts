import { DataSource, EntityManager } from 'typeorm';
export declare abstract class BaseTransaction<TransactionInput, TransactionOutput> {
    private readonly datasource;
    protected constructor(datasource: DataSource);
    protected abstract execute(data: TransactionInput, manager: EntityManager): Promise<TransactionOutput>;
    private createRunner;
    run(data: TransactionInput): Promise<TransactionOutput>;
    runWithinTransaction(data: TransactionInput, manager: EntityManager): Promise<TransactionOutput>;
}
