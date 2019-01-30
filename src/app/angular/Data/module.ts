import { Skill } from './skill';
import { PhysicalPort } from './physical-port';
import { Recipe } from './recipe';
import { PhysicalAdjustmentParameter } from './physical-adjustment-parameter';

export class Module {
    uniqueId: string;
    name: string;
    description: string;
    connected: boolean;
    skills: Skill[];
    address: string;
    status: string;
    manufacturer: string;
    physicalPorts: PhysicalPort[];
    physicalAdjustmentParameters: PhysicalAdjustmentParameter[];
    recipes: Recipe[];

    internalModules: Module[];
    parentId: string;
    parentType: string;

    registered: Date;
}
