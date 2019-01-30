import { PhysicalAdjustmentParameter } from './physical-adjustment-parameter';

export class PhysicalAdjustmentParameterSetting {
    uniqueId: string;
    name: string;
    description: string;

    value: string;
    parameter: PhysicalAdjustmentParameter;

    registered: Date;

}
