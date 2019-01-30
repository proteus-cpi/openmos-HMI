import { SkillType } from './skill-type';
import { Part } from './part';
import { SkillReqPrecedent } from './skill-req-precedent';

export class SkillRequirement {
    uniqueId: string;
    name: string;
    description: string;

    // Refactoring from type to srType (skill requirement type)
    srType: string;
    skillType: SkillType;

    // precedents: SkillRequirement[];
    // precedentIds: string[];
    precedents: SkillReqPrecedent[];

    requiresPart: Part;

    registered: string;

    recipeIDs: string[];

    selectedRecipesIds: any[];

    isError: boolean;
}
