export interface ITableColumn {
  en_name: string;
  fa_name: string;
  isVisible: boolean;
  render?: () => void;
}
