import { Parameter } from './parameter';

export class ParameterSetting {
    uniqueId: string;
    name: string;
    description: string;

    value: string;
    parameter: Parameter;

    registered: Date;

    constructor(paramSetting: ParameterSetting) {
        this.uniqueId = paramSetting.uniqueId;
        this.name = paramSetting.name;
        this.description = paramSetting.description;
        this.value = paramSetting.value;
        this.parameter = paramSetting.parameter;
        this.registered = paramSetting.registered;
    }
}
