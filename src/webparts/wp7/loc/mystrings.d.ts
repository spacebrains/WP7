declare interface IWp7WebPartStrings {
  PropertyPaneDescription: string;
  DescriptionListsFieldLabel:string;
  MainMessage:string;
  ResultNotFound:string;
  FilterByTerm:string;
  ShowAll:string;
  listEmpty:string;
  WaitPlease:string;
}

declare module 'Wp7WebPartStrings' {
  const strings: IWp7WebPartStrings;
  export = strings;
}
