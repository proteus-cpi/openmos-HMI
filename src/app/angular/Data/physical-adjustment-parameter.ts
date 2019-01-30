export class PhysicalAdjustmentParameter {
    uniqueId: string;
    name: string;
    description: string;
    defaultValue: string;
    lowerBound: string;

    // Refactoring from type to papType (physical adjustment parameter type)
    papType: string;
    unit: string;
    upperBound: string;
    valueType: string;

    registered: Date;
}
