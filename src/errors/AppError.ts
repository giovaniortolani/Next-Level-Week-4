export class AppError {
  // Deixamos readonly pois não precisaremos alterar no futuro.
  // Apenas o construtor pode definir o valor da propriedade.
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400 /* por padrão é 400 */) {
    this.message = message;
    this.statusCode = statusCode;
  }
}