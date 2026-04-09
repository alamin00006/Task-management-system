import { UsersService } from "./users.service";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        role: string;
        id: string;
        name: string;
        email: string;
    }[]>;
}
