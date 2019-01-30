import { KPI } from './kpi';

export class InformationPort {
    uniqueId: string;
    name: string;
    description: string;
    // Refactoring from type to portType
    portType: string;
    direction: string;
    kpis: KPI[];
    registered: Date;
}
