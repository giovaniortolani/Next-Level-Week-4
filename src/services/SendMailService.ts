import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

class SendMailService {
  private client: Transporter;

  constructor() {
    // Não conseguimos usar async/await aqui pois o constructor não pode ser async.
    // Então utilizaremos .then()
    nodemailer.createTestAccount()
      .then(account => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
          }
        });

        // Precisaremos usar o transporter em outros métodos da classe.
        this.client = transporter;
      });
  }
  async execute(to: string, subject: string, variables: object, path: string) {
    // const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs'); // a partir da pasta desse arquivo caminha no diretório até o npsMail.hbs
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html, // recebe o html totalmente parseado a partir do template
      from: 'NPS <donotreply@example.com>'
    });

    console.log('Message send: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService(); // já cria automaticamente a instância e a retorna quando for importado em outro arquivo.