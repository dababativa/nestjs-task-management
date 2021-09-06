import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  // Attributes
  private tasks: Task[] = [];

  // Methods

  // returns all tasks in the task array
  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDTO: GetTasksFilterDTO): Task[] {
    const { status, search } = filterDTO;

    let tasks = this.getAllTasks();

    // status branch
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    // search branch
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    // return
    return tasks;
  }

  // returns a tasks with the same id
  getTaskById(id: string): Task {
    // find task
    const task = this.tasks.find((task) => task.id === id);
    //if task not found return 404
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  // creates a task, pushes into the array and returns it
  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  // filters the current tasks list to exclude the one we want to delete
  deleteTask(id: string): void {
    const task = this.getTaskById(id)
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  // patch task
  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
