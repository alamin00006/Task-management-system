import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['Low', 'Medium', 'High'])
  priority?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;
}
