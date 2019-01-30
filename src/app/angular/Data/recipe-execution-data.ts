import { KPISetting } from './kpi-setting';
import { ParameterSetting } from './parameter-setting';

export class RecipeExecutionData {
    productInstanceId: string;

    recipeId: string;

    kpiSettings: KPISetting[];

    ParameterSetting: ParameterSetting[];

    registered: Date;
}
