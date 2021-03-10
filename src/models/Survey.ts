import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('surveys')
class Survey {

  @PrimaryColumn() // chave primária
  readonly id: string; // aqui no TS é uma string, porém para o banco é UUID
                       // readonly: somente a classe poderá alterar o valor. Quem estiver integeradindo com ela não poderá.

  @Column() // se o nome da coluna for igual ao atributo, não precisa passar nada. Do contrário, precisa passar o nome correto da coluna.
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) { // só gera o id caso a survey não o possua (ou seja, no momento da criação dela e não da edição)
      this.id = uuid();
    }
  }
}

export { Survey };