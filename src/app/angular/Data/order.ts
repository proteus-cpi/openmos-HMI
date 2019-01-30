import { OrderLine } from './order-line';

export class Order {
    uniqueId: string;

    name: string;

    description: string;

    priority: number;

    orderLines: OrderLine[];
}
