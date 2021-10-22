/* eslint-disable prettier/prettier */
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => {
  return {
    getTasks: jest.fn(),
    findOne: jest.fn(),
  };
};

const mockUser = {
  username: 'Ariel',
  id: '1',
  password: 'password',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // start a NestJs dummy module with the variables service and repository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);

  });

  // getTasks unit test
  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue')
  });
  });


  // getTaskById unit test
  describe('getTasksById', () => {
      it('calls TasksRepository.findOne and returns the result', async () => {
          const mockTask = {
            title: 'Title',
            description: 'Description',
            id: '1',
            status: TaskStatus.OPEN,
          };
          tasksRepository.findOne.mockResolvedValue(mockTask);
          const task = await tasksService.getTaskById('1', mockUser)
          expect(task).toEqual(mockTask);
      })

      it('calls TasksRepository.findOne and handles an error', async () => {
          tasksRepository.findOne.mockResolvedValue(null);
          expect(tasksService.getTaskById('1', mockUser)).rejects.toThrow(NotFoundException)
      })
  })

});
