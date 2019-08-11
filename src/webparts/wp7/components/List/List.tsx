import * as React from 'react';
import {IItems} from '../Wp7';
import {DetailsList} from "office-ui-fabric-react";




interface IListProps {
  items: Array<IItems>;
}


const List: React.FC<IListProps> = ({items}: IListProps) => {

 /**/

  return(
    <>
      {(items && items.length > 0) ?
        <DetailsList items={items}/>
        : <div>list is empty</div>}
    </>
  );
};

export default List;