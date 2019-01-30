import { ExecutionTable } from "./execution-table";
import { Skill } from './skill';
import { Recipe } from './recipe';
import { Equipment } from './equipment';
import { PhysicalLocation } from './physical-location';
import { LogicalLocation } from './logical-location';

export class CyberPhysicalDescription{
    equipmentId: string;

    executionTable: ExecutionTable;

    skills: Skill[];

    recipes: Recipe[];

    equipments: Equipment[];

    physicalLocation: PhysicalLocation;

    logicalLocation: LogicalLocation;

    type: string;

    registeredTimestamp: Date;
}