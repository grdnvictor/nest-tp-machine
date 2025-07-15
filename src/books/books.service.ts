import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddToCollectionDto, CreateBookDto, UpdateUserBookDto } from './dto/books.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async createBook(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: createBookDto,
    });
  }

  async getAllBooks() {
    return this.prisma.book.findMany({
      orderBy: { title: 'asc' },
    });
  }

  async getMyCollection(userId: number) {
    return this.prisma.userBook.findMany({
      where: { userId },
      include: {
        book: true,
      },
      orderBy: { addedAt: 'desc' },
    });
  }

  async addToCollection(userId: number, addToCollectionDto: AddToCollectionDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: addToCollectionDto.bookId },
    });

    if (!book) {
      throw new NotFoundException('Livre non trouvé');
    }

    return this.prisma.userBook.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId: addToCollectionDto.bookId,
        },
      },
      update: {
        status: addToCollectionDto.status,
        rating: addToCollectionDto.rating,
        review: addToCollectionDto.review,
      },
      create: {
        userId,
        bookId: addToCollectionDto.bookId,
        status: addToCollectionDto.status,
        rating: addToCollectionDto.rating,
        review: addToCollectionDto.review,
      },
      include: {
        book: true,
      },
    });
  }

  async updateUserBook(userId: number, userBookId: number, updateDto: UpdateUserBookDto) {
    const userBook = await this.prisma.userBook.findFirst({
      where: {
        id: userBookId,
        userId,
      },
    });

    if (!userBook) {
      throw new NotFoundException('Livre non trouvé dans votre collection');
    }

    return this.prisma.userBook.update({
      where: { id: userBookId },
      data: updateDto,
      include: {
        book: true,
      },
    });
  }

  async removeFromCollection(userId: number, userBookId: number) {
    const userBook = await this.prisma.userBook.findFirst({
      where: {
        id: userBookId,
        userId,
      },
    });

    if (!userBook) {
      throw new NotFoundException('Livre non trouvé dans votre collection');
    }

    await this.prisma.userBook.delete({
      where: { id: userBookId },
    });

    return { message: 'Livre retiré de votre collection' };
  }

  // Admin only
  async getAllCollections() {
    return this.prisma.userBook.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        book: true,
      },
      orderBy: { addedAt: 'desc' },
    });
  }

  async getCollectionStats() {
    const totalBooks = await this.prisma.book.count();
    const totalUsers = await this.prisma.user.count();
    const totalUserBooks = await this.prisma.userBook.count();

    const mostPopularBooks = await this.prisma.userBook.groupBy({
      by: ['bookId'],
      _count: {
        bookId: true,
      },
      orderBy: {
        _count: {
          bookId: 'desc',
        },
      },
      take: 10,
    });

    const booksWithDetails = await Promise.all(
      mostPopularBooks.map(async (item) => {
        const book = await this.prisma.book.findUnique({
          where: { id: item.bookId },
        });
        return {
          book,
          count: item._count.bookId,
        };
      }),
    );

    return {
      totalBooks,
      totalUsers,
      totalUserBooks,
      mostPopularBooks: booksWithDetails,
    };
  }
}