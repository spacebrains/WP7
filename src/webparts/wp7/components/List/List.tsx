import * as React from 'react';
import * as strings from 'Wp7WebPartStrings';
import { IItems } from '../Wp7';
import { DetailsList, Dropdown, IDropdownOption } from "office-ui-fabric-react";



interface IListProps {
  items: Array<IItems>;
  terms: Array<IDropdownOption>;
  setSearchTerms: Function;
}


const List: React.FC<IListProps> = ({ items, terms, setSearchTerms }: IListProps) => {

  return (
    <>
      {(items && items.length > 0) ?
        <div>
          <Dropdown label={strings.FilterByTerm} options={terms} onChanged={(e) => setSearchTerms(e.text)} />
          <DetailsList items={items} />
        </div>
        : <div>list is empty</div>}
    </>
  );
};

export default List;