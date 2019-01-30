import { Parameter } from './parameter';

export class ParameterPort {
    uniqueId: string;
    name: string;
    description: string;
    // Refactoring from type to portType
    portType: string;
    direction: string;
    parameters: Parameter[];
    registered: Date;
}
