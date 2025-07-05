// export interface CountryMaster {
//   CountryID: number | null = null;
//   BillCompanyCountryID: number | null = null;
//   CountryCode: string | null = null;
//   CountryName: string | null = null;
//   CountryISOCode: string | null = null;
//   IsDefault: boolean | null = null;
//   ReasonToUpdate: string | null = null;
//   ActionType: string | null = null;
// }

export interface CountryMaster {
  CountryID: number;
  CountryCode: string;
  CountryName: string;
  CountryISOCode: string;
}
