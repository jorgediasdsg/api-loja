import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
}

class DeleteCustomerService {
  public async execute({ id }: IRequest): Promise<void> {
    const customerRepository = getCustomRepository(CustomersRepository);

    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    await customerRepository.remove(customer);
  }
}

export default DeleteCustomerService;
