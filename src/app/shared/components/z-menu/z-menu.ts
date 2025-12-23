export interface MenuItem {
    label: string;
    icon?: string;
    items?: MenuItem[];
    url?: string;
    expanded?: boolean;
    disabled?: boolean;
    seperator?: boolean;
    command?: (event?: any) => void;
}
