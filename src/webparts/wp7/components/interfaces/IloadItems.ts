//JSON2TS
export default interface ILoadItems {
  'odata.metadata': string;
  ElapsedTime: number;
  PrimaryQueryResult: PrimaryQueryResult;
  Properties: Property[];
  SecondaryQueryResults: any[];
  SpellingSuggestion: string;
  TriggeredRules: any[];
}

interface PrimaryQueryResult {
  CustomResults: any[];
  QueryId: string;
  QueryRuleId: string;
  RefinementResults?: any;
  RelevantResults: RelevantResults;
  SpecialTermResults?: any;
}

interface RelevantResults {
  GroupTemplateId?: any;
  ItemTemplateId?: any;
  Properties: Property[];
  ResultTitle?: any;
  ResultTitleUrl?: any;
  RowCount: number;
  Table: Table;
  TotalRows: number;
  TotalRowsIncludingDuplicates: number;
}

interface Table {
  Rows: Row[];
}

interface Row {
  Cells: Cell[];
}

interface Cell {
  Key: string;
  Value?: string;
  ValueType: string;
}

interface Property {
  Key: string;
  Value: string;
  ValueType: string;
}