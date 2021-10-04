import { User } from 'src/auth/user.entity';
import { Brackets, EntityRepository, QueryBuilder, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({ title, description, status: TaskStatus.OPEN, user });
    await this.save(task);
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    console.log(status, search);
    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            'task.title ILIKE :search or task.description ILIKE :search',
            { search: `%${search}%` },
          );
        }),
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
}
