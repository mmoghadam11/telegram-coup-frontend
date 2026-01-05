/**
 * @example {
 *     id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *     name: "string",
 *     address: "string",
 *     tellNumber: "string",
 *     quiddityUnit: "string",
 *     levelUnit: "string",
 *     code: "string",
 *     active: true,
 *     codePath: "string",
 *     expireDate: "2024-01-11T06:05:58.186Z",
 *     startDate: "2024-01-11T06:05:58.186Z",
 *     commonBaseDataFundamentalBaseId: 0,
 *     unitType: 0,
 *     workOrgCapacity: 0,
 *     taskOrgCapacity: 0,
 *     commonBaseDataTaxonomyId: 0,
 *     completeName: "string",
 *     geometricLocation: "string",
 *     geometricLocation_x: 0,
 *     geometricLocation_y: 0,
 *     province: 0,
 *     parentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 * }
 */
export interface IWorkflow {
    id: string;
    name: string;
    address: string;
    tellNumber: string;
    quiddityUnit: string;
    levelUnit: string;
    code: string;
    active: boolean;
    codePath: string;
    /**
     * @description can convert into Date
     * @example "2024-01-11T06:05:58.186Z",
     */
    expireDate: string;
    /**
     * @description can convert into Date
     * @example "2024-01-11T06:05:58.186Z",
     */
    startDate: string;
    commonBaseDataFundamentalBaseId: string | number;
    unitType: string | number;
    workOrgCapacity: string | number;
    taskOrgCapacity: string | number;
    commonBaseDataTaxonomyId: string | number;
    completeName: string;
    geometricLocation: string;
    geometricLocation_x: string | number;
    geometricLocation_y: string | number;
    province: string | number;
    parentId: string;
}