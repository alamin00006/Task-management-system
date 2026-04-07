import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsIn(['Low', 'Medium', 'High'])
  priority: string;

  @IsString()
  @IsNotEmpty()
  assigneeId: string;

  @IsString()
  @IsOptional()
  dueDate?: string;
}
