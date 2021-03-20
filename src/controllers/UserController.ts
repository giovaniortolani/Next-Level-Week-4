import { Request, Response } from 'express'; // Precisamos importar o Request e Reponse do express para usá-los na tipagem dos parâmetros de UserController.create.
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
import { UsersRepository } from '../repositories/UsersRepository';

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    });

    // Podemos passar diretamente o request.body em vez do name e email, pois ele vai acabar procurando o name e email dentro do request.body.
    /* if (!(await schema.isValid(request.body))) {
      return response.status(400).json({
        error: 'Validation failed'
      });
    } */
    // Fazendo de outra maneira mais elegante, podemos utilizar o schema.validate(), que gerar uma exceção contendo todos os erros de validação.
    // abortEarly: false faz com que a validação não pare no primeiro erro encontrado.
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch(error) {
      throw new AppError(error);
    }

    // criamos um repositório de usuários para termos acesso a alguns métodos disponíveis no TypeORM
    const usersRepository = getCustomRepository(UsersRepository);

    // verificamos se já existe o usuário que queremos inserir no banco
    // SELECT * FROM USERS WHERE EMAIL = "<email>"
    const userAlreadyExists = await usersRepository.findOne({
      email
    });

    if (userAlreadyExists) {
      throw new AppError('User already exists');
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
