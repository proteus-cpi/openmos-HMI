export class KPI {
    uniqueId: string;
    name: string;
    description: string;
    // Refactoring from type to kpiType
    kpiType: string;
    unit: string;
    valueType: string;
    value: string;
    registered: Date;

    defaultUpperBound: string;
    defaultLowerBound: string;
}
