import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuration pour MailDev en développement
    this.transporter = nodemailer.createTransport({
      host: 'maildev',
      port: 1025,
      secure: false,
      auth: undefined,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: 'noreply@booktracker.com',
      to: email,
      subject: 'Vérifiez votre adresse email',
      html: `
        <h1>Bienvenue sur BookTracker!</h1>
        <p>Cliquez sur le lien ci-dessous pour vérifier votre adresse email:</p>
        <a href="${verificationUrl}">Vérifier mon email</a>
        <p>Ou copiez ce lien dans votre navigateur: ${verificationUrl}</p>
      `,
    });
  }

  async sendTwoFactorCode(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: 'noreply@booktracker.com',
      to: email,
      subject: 'Code de connexion BookTracker',
      html: `
        <h1>Code de connexion</h1>
        <p>Votre code de connexion à deux facteurs est:</p>
        <h2 style="background: #f0f0f0; padding: 10px; text-align: center;">${code}</h2>
        <p>Ce code expire dans 10 minutes.</p>
      `,
    });
  }
}