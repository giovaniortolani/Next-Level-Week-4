import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";


class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email }); // verifico se esse usuário está no banco
    if (!user) { // se o usuário não estiver no banco, retorna erro
      throw new AppError('User does not exists');
    }

    const survey = await surveysRepository.findOne({ id: survey_id }); // recebemos survey_id da requisição, porém na tabela a coluna é id
    if (!survey) {
      throw new AppError('Survey does not exists');
    }

    let surveyUser = await surveysUsersRepository.findOne({
      where: { user_id: user.id, survey_id: survey.id, value: null }, // email já foi enviado para essa pessoa com essa survey, porém ela não respondeu
      relations: ['user', 'survey']
    });

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs'); // a partir da pasta desse arquivo caminha no diretório até o npsMail.hbs
    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: '',
      link: process.env.URL_MAIL // definido em .env
    };

    if (surveyUser) {
      variables.id = surveyUser.id;
      // Envia email para usuário
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUser);
    }

    // Criamos a entrada e salvamos no banco.
    surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });
    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id;

    // Envia email para usuário
    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser);
  }
}

export { SendMailController };
