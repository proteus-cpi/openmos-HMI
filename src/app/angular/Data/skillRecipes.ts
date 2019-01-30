import { Recipe } from './recipe';
import { Skill } from './skill';

export class SkillRecipes {
    skill: Skill;

    associatedRecipes: Recipe[];
}
