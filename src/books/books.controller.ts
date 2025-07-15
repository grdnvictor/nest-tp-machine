import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../auth/decorators/auth.decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BooksService } from './books.service';
import { AddToCollectionDto, CreateBookDto, UpdateUserBookDto } from './dto/books.dto';

@ApiTags('Books')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau livre' })
  @ApiResponse({ status: 201, description: 'Livre créé avec succès' })
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir tous les livres disponibles' })
  @ApiResponse({ status: 200, description: 'Liste des livres' })
  async getAllBooks() {
    return this.booksService.getAllBooks();
  }

  @Get('my-collection')
  @ApiOperation({ summary: 'Obtenir ma collection personnelle' })
  @ApiResponse({ status: 200, description: 'Collection personnelle' })
  async getMyCollection(@Req() req: Request) {
    return this.booksService.getMyCollection(req['user'].id);
  }

  @Post('add-to-collection')
  @ApiOperation({ summary: 'Ajouter un livre à ma collection' })
  @ApiResponse({ status: 201, description: 'Livre ajouté à la collection' })
  @ApiResponse({ status: 404, description: 'Livre non trouvé' })
  async addToCollection(
    @Req() req: Request,
    @Body() addToCollectionDto: AddToCollectionDto,
  ) {
    return this.booksService.addToCollection(req['user'].id, addToCollectionDto);
  }

  @Put('my-collection/:id')
  @ApiOperation({ summary: 'Mettre à jour un livre dans ma collection' })
  @ApiResponse({ status: 200, description: 'Livre mis à jour' })
  @ApiResponse({ status: 404, description: 'Livre non trouvé dans votre collection' })
  async updateUserBook(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateDto: UpdateUserBookDto,
  ) {
    return this.booksService.updateUserBook(req['user'].id, +id, updateDto);
  }

  @Delete('my-collection/:id')
  @ApiOperation({ summary: 'Retirer un livre de ma collection' })
  @ApiResponse({ status: 200, description: 'Livre retiré de la collection' })
  @ApiResponse({ status: 404, description: 'Livre non trouvé dans votre collection' })
  async removeFromCollection(@Req() req: Request, @Param('id') id: string) {
    return this.booksService.removeFromCollection(req['user'].id, +id);
  }

  // Admin endpoints
  @Roles(Role.ADMIN)
  @Get('admin/all-collections')
  @ApiOperation({ summary: 'Admin: Voir toutes les collections' })
  @ApiResponse({ status: 200, description: 'Toutes les collections d\'utilisateurs' })
  async getAllCollections() {
    return this.booksService.getAllCollections();
  }

  @Roles(Role.ADMIN)
  @Get('admin/stats')
  @ApiOperation({ summary: 'Admin: Statistiques globales' })
  @ApiResponse({ status: 200, description: 'Statistiques de la plateforme' })
  async getStats() {
    return this.booksService.getCollectionStats();
  }
}