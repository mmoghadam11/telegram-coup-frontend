export interface FullInstituteType {
  /**@description اطلاعات پایه */
  name: string;
  latinName: string;
  nationalId: string;
  registerNo: string;
  registerDate: string;
  establishmentDate: string;
  // instituteName: string;
  // englishName: string;
  // nationalId: string;
  // registrationNumber: string;
  // registrationDate: string;
  // registrationLocation: string;

  // establishmentDate: string;
  cdRegisterPlaceId:any;
  status: string;

  /**@description اطلاعات عضویت و پروانه */
  membershipNo: string;
  memberShipDate: string;
  professionalLicenceNo: string;
  // membershipNumber: string;
  // membershipDate: string;
  // licenseNumber: string;
  licenseDate: string;
  licenseExpiry: string;
  // lastLicenseDate: string;
  lastLicenceIssueDate: string;

  /**@description اطلاعات مالی */
  economicCode: string;
  taxAreaCode: string;
  financeYear: string;
  financeYearBeginDate: string;
  financeYearEndDate: string;
  cdOwnershipTypeId: string;
  officialAreaSize: string;
  // economicCode: string;
  // taxCode: string;
  // fiscalYear: string;
  // fiscalYearStart: string;
  // fiscalYearEnd: string;
  // ownershipType: string;
  // officeArea: string;

  /**@description  اطلاعات تماس*/
  officePhoneNo: string;
  officeFaxNo: string;
  officeEmail: string;
  officeWebSite: string;
  // phone: string;
  // fax: string;
  // email: string;
  // website: string;

  /**@description اطلاعات مدیرعامل*/
  directorFirstName: string;
  directorLastName: string;
  directorNationalCode: string;
  directorAcceptanceDate: string;
  directorTerminateDate: string;
  directorMobileNo: string;
  // ceoFirstName: string;
  // ceoLastName: string;
  // ceoNationalId: string;
  // ceoStartDate: string;
  // ceoEndDate: string;
  // ceoMobile: string;

  /**@description اطلاعات هیئت مدیره */
  boardMembers: string;
  boardMembersNationalIds: string;
  boardMembersStartDate: string;
  boardMembersEndDate: string;

  /**@description رتبه‌بندی و کنترل */
  statusControlRank: string;
  statusControlScore: string;
  statusControlRankReceiptDate: string;
  statusControlRankReceiptLetterNo: string;
  qcRank: string;
  qcScore: string;
  qcRankReceiptDate: string;
  qcRankReceiptLetterNo: string;
  // statusRank: string;
  // statusScore: string;
  // statusRankDate: string;
  // statusRankLetterNumber: string;
  // qualityRank: string;
  // qualityScore: string;
  // qualityRankDate: string;
  // qualityRankLetterNumber: string;

  /**@description اطلاعات تخصصی */
  burseTrustee: string;
  burseTrustReceiptDate: string;
  burseRejectionReceiptDate: string;
  centralBankTrustee: string;
  centralInsuranceTrustee: string;
  courtAccountsTrustee: string;
  // moneyLaunderingCombatingManagerName: string;
  // moneyLaunderingCombatingManagerNationalcode: string;
  moneyLaunderingCombatingManagerId?:string;
  // relationshipTypeName: string;
  cdRelationshipTypeId: any;
  auditorName: string;
  officialNewspaperMergeDate: string;
  mergingInstitutionName: string;
  mergingInstitutionMembershipNo: string;
  dissolutionDate: string;
  dissolutionOfficialNewspaperNo: string;
  dissolutionOfficialNewspaperDate: string;
  // stockExchangeTrustee: string;
  // stockExchangeTrusteeDate: string;
  // stockExchangeRejectionDate: string;
  // centralBankTrustee: string;
  // insuranceTrustee: string;
  // auditCourtTrustee: string;
  // amlManagerName: string;
  // amlManagerNationalId: string;
  // societyRelationType: string;
  // auditorName: string;
  // mergerDate: string;
  // mergedInstituteName: string;
  // mergedInstituteMembership: string;
  // dissolutionDate: string;
  // dissolutionGazetteNumber: string;
  // dissolutionGazetteDate: string;
}
