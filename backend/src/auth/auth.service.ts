import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticate user and generate JWT token
   *
   * @param email - User email
   * @param password - Plain text password
   * @returns JWT access token and user info
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(email: string, password: string) {
    //  Find user by email
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    //  Compare hashed password
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Prepare JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    //  Generate JWT token
    const access_token = this.jwtService.sign(payload);

    //  Return token and sanitized user info
    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
      },
    };
  }

  /**
   * Get authenticated user's profile
   *
   * @param userId - User ID extracted from JWT
   * @returns User profile data
   * @throws UnauthorizedException if user not found
   */
  async getProfile(userId: string) {
    // 🔍 Fetch user from database
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    //  Return safe user data (no password)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
    };
  }
}
