import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma.service';
import { LoginDto, RegisterDto, TwoFactorDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const emailToken = randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        emailToken,
      },
    });

    await this.emailService.sendVerificationEmail(user.email, emailToken);

    return {
      message: 'Utilisateur créé. Vérifiez votre email pour activer votre compte.',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('Token de vérification invalide');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailToken: null,
      },
    });

    return { message: 'Email vérifié avec succès' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Veuillez vérifier votre email d\'abord');
    }

    // Génération du code 2FA
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFactorExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode,
        twoFactorExpiry,
      },
    });

    await this.emailService.sendTwoFactorCode(user.email, twoFactorCode);

    return {
      message: 'Code de vérification envoyé par email',
      requiresTwoFactor: true,
    };
  }

  async verifyTwoFactor(twoFactorDto: TwoFactorDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: twoFactorDto.email },
    });

    if (
      !user ||
      user.twoFactorCode !== twoFactorDto.code ||
      !user.twoFactorExpiry ||
      user.twoFactorExpiry < new Date()
    ) {
      throw new UnauthorizedException('Code de vérification invalide ou expiré');
    }

    // Nettoyer les codes 2FA
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: null,
        twoFactorExpiry: null,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}