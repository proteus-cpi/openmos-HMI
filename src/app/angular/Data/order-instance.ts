import { ProductInstance } from './product-instance';

export class OrderInstance {
    uniqueId: string;

    name: string;

    description: string;

    priority: number;

    productInstances: ProductInstance[];

    registered: Date;
}
