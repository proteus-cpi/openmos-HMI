import { ExecutionTable } from './execution-table';
import { Skill } from './skill';
import { Recipe } from './recipe';
import { PhysicalLocation } from './physical-location';
import { LogicalLocation } from './logical-location';
import { PhysicalPort } from './physical-port';
import { Module } from './module';
import { PhysicalAdjustmentParameter } from './physical-adjustment-parameter';

export class SubSystem {
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

    executionTable: ExecutionTable;
    recipes: Recipe[];
    physicalLocation: PhysicalLocation;
    logicalLocation: LogicalLocation;

    // Refactoring from type to ssType (sub system type)
    ssType: string;
    
    state: string;
    statePath: string;
    
    stage: string;
    stagePath: string;
    
    valid: boolean;
    internalModules: Module[];
    registered: Date;

}
