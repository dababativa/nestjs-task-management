import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDTO {
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    search?: string;
}