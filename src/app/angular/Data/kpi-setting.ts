import { KPI } from './kpi';

export class KPISetting {
    uniqueId: string;
    name: string;
    description: string;
    kpi: KPI;
    // Refactoring from type to kpiSettingType
    kpiSettingType: string;
    unit: string;
    value: string;
    path: string;
    registered: Date;

    constructor(kpiSetting: KPISetting) {
        this.uniqueId = kpiSetting.uniqueId;
        this.name = kpiSetting.name;
        this.description = kpiSetting.description;
        this.kpi = kpiSetting.kpi;
        this.kpiSettingType = kpiSetting.kpiSettingType;
        this.unit = kpiSetting.unit;
        this.value = kpiSetting.value;
        this.path = kpiSetting.path;
        this.registered = kpiSetting.registered;
    }
}
