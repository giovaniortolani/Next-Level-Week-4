import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {

  async execute(request: Request, response: Response) {
    // Exemplo de URL
    // http://localhost:3333/answers/9?u=63bb9c7e-016a-40ae-bbbc-7d9d0d1ac0b6
    // Nela temos os route params e os query params.
    // O primeiro se refere ao parâmetro 9 que vem no próprio path da rota.
    // Já o segundo dispensa apresentações, é o parâmetro "u".
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u) // precisamos fazer o cast para string pois do contrário pode dar erro, já que 'u' pode ser undefined.
    });

    if (!surveyUser) {
      throw new AppError('SurveyUser does not exists.');
    }

    surveyUser.value = Number(value); // precisamos fazer o cast para Number pois o banco espera que ele seja um number e não uma string.

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };