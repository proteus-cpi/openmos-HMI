import { ExecutionTable } from './execution-table';
import { Skill } from './skill';
import { PhysicalPort } from './physical-port';

export class Equipment {

    uniqueId: string;

    name: string;

    description: string;

    connected: boolean;

    skills: Skill[];

    address: string;

    status: string;

    manufacturer: string;

    physicalPorts: PhysicalPort[];

    registeredTimestamp: Date;
    /*
    description: string;

    executionTable: ExecutionTable;

    */
}
