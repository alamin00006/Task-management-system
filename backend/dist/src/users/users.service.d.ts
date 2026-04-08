import { PrismaService } from "../prisma/prisma.service";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        role: string;
        id: string;
        name: string;
        email: string;
    }[]>;
    findById(id: string): Promise<{
        role: string;
        id: string;
        name: string;
        email: string;
    } | null>;
}
