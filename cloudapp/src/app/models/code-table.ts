export interface CodeTableRow {
  code: string;
  description: string;
  enabled: boolean;
}

export interface CodeTable {
  row: CodeTableRow[];
}