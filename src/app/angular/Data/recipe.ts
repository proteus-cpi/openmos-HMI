import { KPISetting } from './kpi-setting';
import { ParameterSetting } from './parameter-setting';
import { SkillRequirement } from './skill-requirement';
import { Skill } from './skill';
import { ControlPort } from './control-port';
import { SubSystem } from './sub-system';
import { Equipment } from './equipment';

export class Recipe {
    uniqueId: string;
    name: string;
    description: string;
    valid: boolean;

    parameterSettings: ParameterSetting[];
    skillRequirements: SkillRequirement[];

    // Added in elux meeting in Bari 2018 jun 29 because of HMI new recipe form changes!
    // TBFinished
    fulfilledSkillRequirements: SkillRequirement[];

    kpiSettings: KPISetting[];

    skill: Skill;
    executedBySkillControlPort: ControlPort;

    uniqueAgentName: string;
    // equipment: Equipment;
    // equipment: SubSystem;
    equipmentIds: string[];
    optimized: boolean;

    lastOptimizationTime: Date;

    msbProtocolEndpoint: string;
    invokeObjectID: string;
    invokeMethodID: string;
    // changeRecipeObjectID: string;
    // changeRecipeMethodID: string;
    state: string;
    statePath: string;

    registered: Date;
}
