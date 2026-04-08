import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieve all users
   * Returns a list of users with basic information
   *
   * @returns Array of users (id, name, email, role)
   */
  async findAll() {
    // Fetch users with selected fields only (avoid sensitive data)
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: "asc" }, // Sort users alphabetically by name
    });

    // Normalize role to lowercase for consistent frontend usage
    return users.map((u) => ({
      ...u,
      role: u.role.toLowerCase(),
    }));
  }

  /**
   * Retrieve a single user by ID
   *
   * @param id - User ID
   * @returns User object or null if not found
   */
  async findById(id: string) {
    //  Find user by unique ID
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Return normalized user or null if not found
    return user
      ? {
          ...user,
          role: user.role.toLowerCase(),
        }
      : null;
  }
}
