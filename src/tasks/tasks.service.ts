import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  // // Methods

  // // returns all tasks in the task array
  getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  // returns a tasks with the same id
  async getTaskById(id:string):Promise<Task>{
    const task = await this.tasksRepository.findOne(id)
    if(!task){
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  // creates a task, pushes into the array and returns it
  createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user)
  }

  // filters the current tasks list to exclude the one we want to delete
  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id)
    if(result.affected === 0 ){
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  // patch task
  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
