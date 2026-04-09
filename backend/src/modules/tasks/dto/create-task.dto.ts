import { IsString, IsNotEmpty, IsOptional, IsIn } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  assigneeId!: string;
}
