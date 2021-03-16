import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Survey } from './Survey';
import { User } from './User';

@Entity('surveys_users')
class SurveyUser {

  @PrimaryColumn() // chave primária
  readonly id: string; // aqui no TS é uma string, porém para o banco é UUID
                       // readonly: somente a classe poderá alterar o valor. Quem estiver integeradindo com ela não poderá.

  @Column() // se o nome da coluna for igual ao atributo, não precisa passar nada. Do contrário, precisa passar o nome correto da coluna.
  user_id: string;

  @ManyToOne(() => User) // muitas surveysUsers podem estar atreladas ao mesmo user
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  survey_id: string;

  @ManyToOne(() => Survey) // muitas surveysUsers podem estar atreladas a mesma survey
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  @Column()
  value: number;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) { // só gera o id caso a survey não o possua (ou seja, no momento da criação dela e não da edição)
      this.id = uuid();
    }
  }
}

export { SurveyUser };
