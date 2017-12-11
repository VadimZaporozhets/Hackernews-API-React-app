import React from 'react';
import Button from '../Button';

const Sort = ({sortKey, onSort, children, activeSortKey}) => {
    const sortClass = ['button-inline'];

    if (sortKey === activeSortKey) {
        sortClass.push('button-active');
    }

    return(
        <Button className={sortClass.join(' ')} onClick={() => onSort(sortKey)}>
            {children}
        </Button>
    )
}


export default Sort;