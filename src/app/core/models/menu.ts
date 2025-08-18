export interface Menu {
    Path?: string;
    Title?: string;
    Icon?: string;
    MenuType?: string;
    Children?: Menu[];
    Active: boolean;
    Selected: boolean;
  }

  export interface BreadcrumbTrail {
    label: string;
    url?: string;
  }