export interface IOrganization {
    id?: string;
    name?: string;
    address?: string;
    tellNumber?: string;
    quiddityUnit?: string;
    levelUnit?: string;
    code?: string;
    active?: boolean;
    codePath?: string;
    expireDate?: string; // act and play like Date
    startDate?: string; // act and play like Date
    commonBaseDataFundamentalBaseId?: number;
    unitType?: number;
    workOrgCapacity?: number;
    taskOrgCapacity?: number;
    commonBaseDataTaxonomyId?: number;
    completeName?: string;
    geometricLocation?: string;
    geometricLocation_x?: number;
    geometricLocation_y?: number;
    province?: number;
    parentId?: string;
}
