import * as React from 'react';
import * as strings from 'Wp7WebPartStrings';
import { IItems } from '../Wp7';
import { DetailsList, Dropdown, IDropdownOption } from "office-ui-fabric-react";



interface IListProps {
  items: Array<IItems>;
  terms: Array<IDropdownOption>;
  setFilter: Function;
  filterСondition:string;
}


const List: React.FC<IListProps> = ({ items, terms, setFilter, filterСondition }: IListProps) => {
  const options=[{ key: strings.ShowAll, text: strings.ShowAll }, ...terms];
  return (
    <>
      {(items && items.length > 0) ?
        <div>
          <Dropdown
            label={strings.FilterByTerm}
            defaultSelectedKey={filterСondition}
            options={options}
            onChanged={(e) => setFilter(e.key)}
          />
          <DetailsList items={items} />
        </div>
        : <div>{strings.listEmpty}</div>}
    </>
  );
};

export default List;