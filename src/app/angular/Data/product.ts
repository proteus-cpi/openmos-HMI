import { SkillRequirement } from './skill-requirement';
import { Part } from './part';

export class Product {
    uniqueId: string;
    name: string;
    description: string;

    parts: Part[];
    skillRequirements: SkillRequirement[];

    registered: Date;
}
