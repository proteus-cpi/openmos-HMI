import { SkillRequirement } from './skill-requirement';
import { PartInstance } from './part-instance';
import { ProductInstanceStatus } from './product-instance-status';

export class ProductInstance {
    uniqueId: string;
    name: string;
    description: string;

    productId: string;
    orderId: string;

    partInstances: PartInstance[];

    finished: boolean;
    finishedTime: Date;

    startedProductionTime: Date;
    hasAgent: boolean;

//    skillRequirements: SkillRequirement[];

    registered: Date;
}
