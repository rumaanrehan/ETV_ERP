export interface ActionBarAction {
  key: string;                 // 'delete', 'approve', 'export'
  label: string;               // UI text
  icon?: string;               // optional icon class
  color?: 'primary' | 'warn';  // optional styling
  disabled?: boolean;
}
