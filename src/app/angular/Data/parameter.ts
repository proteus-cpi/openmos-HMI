export class Parameter {
    uniqueId: string;
    name: string;
    description: string;
    defaultValue: string;
    lowerBound: string;

    // Refactoring from type to pType
    pType: string;
    unit: string;
    upperBound: string;
    valueType: string;

    registered: Date;
}
