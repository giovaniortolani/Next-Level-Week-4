import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('users')
class User {

  @PrimaryColumn() // chave primária
  readonly id: string; // aqui no TS é uma string, porém para o banco é UUID
                       // readonly: somente a classe poderá alterar o valor. Quem estiver integeradindo com ela não poderá.

  @Column() // se o nome da coluna for igual ao atributo, não precisa passar nada. Do contrário, precisa passar o nome correto da coluna.
  name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) { // só gera o id caso o usuário não o possua (ou seja, no momento da criação dele e não da edição)
      this.id = uuid();
    }
  }
}

export { User };