import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/auth.decorators';
import { LoginDto, RegisterDto, TwoFactorDto, VerifyEmailDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Get('verify-email')
  @ApiOperation({ summary: 'Vérification de l\'email' })
  @ApiResponse({ status: 200, description: 'Email vérifié avec succès' })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur (étape 1)' })
  @ApiResponse({ status: 200, description: 'Code 2FA envoyé' })
  @ApiResponse({ status: 401, description: 'Identifiants incorrects' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('verify-2fa')
  @ApiOperation({ summary: 'Vérification du code 2FA (étape 2)' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Code invalide ou expiré' })
  async verifyTwoFactor(@Body() twoFactorDto: TwoFactorDto) {
    return this.authService.verifyTwoFactor(twoFactorDto);
  }
}