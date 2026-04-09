import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { LoginDto } from "./dto/login.dto";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * User login endpoint
   * Validates user credentials and returns JWT token
   *
   * @param dto - Login data (email, password)
   * @returns Access token and user info
   */
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  /**
   * Get authenticated user's profile
   * Requires JWT authentication
   *
   * @param userId - Extracted from JWT via custom decorator
   * @returns User profile information
   */
  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  async getProfile(@CurrentUser("id") userId: string) {
    return this.authService.getProfile(userId);
  }
}
