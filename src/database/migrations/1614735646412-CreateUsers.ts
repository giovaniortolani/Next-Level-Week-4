import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsers1614735646412 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users', // nome da tabela
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true // chave primária
          },
          {
            name: 'name',
            type: 'varchar'
          },
          {
            name: 'email',
            type: 'varchar'
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()' // na hora da criação de um objeto na tabela de usuários já atribuiu a data de criação automaticamente
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }

}
