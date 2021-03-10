import { Request, Response } from 'express'; // Precisamos importar o Request e Reponse do express para usá-los na tipagem dos parâmetros de UserController.create.
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';


class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    // criamos um repositório de usuários para termos acesso a alguns métodos disponíveis no TypeORM
    const usersRepository = getCustomRepository(UsersRepository);

    // verificamos se já existe o usuário que queremos inserir no banco
    // SELECT * FROM USERS WHERE EMAIL = "<email>"
    const userAlreadyExists = await usersRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      return response.status(400).json({
        error: 'Users already exists'
      });
    }

    const user = usersRepository.create({
      name,
      email
    });

    // Não dá para passar o objeto diretamente para o método .save. Precisamos usar .create antes disse e passar o retorno dele.
    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
