import { KPI } from './kpi';
import { Parameter } from './parameter';
import { SkillType } from './skill-type';
import { InformationPort } from './information-port';
import { ParameterPort } from './parameter-port';
import { ControlPort } from './control-port';
import { SkillRequirement } from './skill-requirement';

export class Skill {
    uniqueId: string;
    name: string;
    description: string;

    /**
     * Field "type" renamed to "skType".
     */
    // type: string;
    skType: string;
    // skillType: SkillType[];
    // skillType: string;
    skillType: SkillType;

    kpis: KPI[];
    informationPorts: InformationPort[];

    parameters: Parameter[];
    parameterPorts: ParameterPort[];

    // classificationType: string[];
    classificationType: number;

    skillRequirements: SkillRequirement[];

    recipeIds: string[];
    controlPorts: ControlPort[];

    subSystemId: string;

    label: string;

    registered: Date;
}
