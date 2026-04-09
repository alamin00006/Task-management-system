import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(AuthGuard("jwt"))
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Get all users
   * Requires JWT authentication
   *
   * @returns List of users (id, name, email, role)
   */
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}
