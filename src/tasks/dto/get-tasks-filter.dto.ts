import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task.model";

export class GetTasksFilterDTO {
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    search?: string;
}