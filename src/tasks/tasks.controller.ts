import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { request } from 'express';
import { title } from 'process';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  // Constructor
  constructor(private tasksService: TasksService) {}

  // Methods
  @Get()
  getTasks(@Query() filterDTO: GetTasksFilterDTO): Task[] {
    // if we have any filters defined, call getTasksWithFilter
    // otherwise get all tasks
    if (Object.keys(filterDTO).length) {
      return this.tasksService.getTasksWithFilter(filterDTO)
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO) {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Body() updateTaskStatusDto: UpdateTaskStatusDTO,
    @Param('id') id: string,
  ): Task {
    const {status} = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
