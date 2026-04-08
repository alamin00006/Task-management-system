import { Prisma } from "@prisma/client";
export interface ErrorHandlingOptions {
    entity?: string;
    uniqueFieldMap?: {
        [key: string]: string;
    };
    foreignKeyMap?: {
        [key: string]: string;
    };
    customMessages?: {
        [errorCode: string]: string;
    };
}
export declare class PrismaErrorHandler {
    handleError(error: any, options?: ErrorHandlingOptions, defaultMessage?: string): never;
    private getPrismaErrorMessage;
    private createException;
    private getUniqueConstraintMessage;
    private getForeignKeyMessage;
    private capitalize;
    wrapPrismaCall<T>(prismaCall: () => Promise<T>, options?: ErrorHandlingOptions): Promise<T>;
    isPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError;
}
