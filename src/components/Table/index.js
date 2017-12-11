import React from 'react';
import Button from '../Button';
import Sort from '../Sort';
import { sortBy } from 'lodash';
import {largeColumn, midColumn, smallColumn} from '../../constants';

const SORTING = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
}

const Table = ({list, onDelete, onSort, sortKey, isSortingReversed}) => {
    const sortedList = SORTING[sortKey](list);
    const reverseSortedList = isSortingReversed
        ? sortedList.reverse()
        : sortedList;
    return (
        <div className="table">
            <div className="table-header">
                <span style={largeColumn}>
                    <Sort
                        sortKey={'TITLE'}
                        onSort={onSort}
                        activeSortKey={sortKey}
                    >
                        Title
                    </Sort>
                </span>
                <span style={midColumn}>
                    <Sort
                        sortKey={'AUTHOR'}
                        onSort={onSort}
                        activeSortKey={sortKey}
                    >
                        Author
                    </Sort>
                </span>
                <span style={{width: '10%'}}>
                    <Sort
                        sortKey={'COMMENTS'}
                        onSort={onSort}
                        activeSortKey={sortKey}
                    >
                        Comments
                    </Sort>
                </span>
                <span style={{width: '10%'}}>
                    <Sort
                        sortKey={'POINTS'}
                        onSort={onSort}
                        activeSortKey={sortKey}
                    >
                        Points
                    </Sort>
                </span>
                <span style={{width: '10%'}}>
                    Archive
                </span>
            </div>
            {reverseSortedList.map(item => {
                return (
                    <div className="table-row" key={item.objectID}>
                        <span style={largeColumn}>
                            <a href={item.url}>{item.title}</a>
                        </span>
                        <span style={midColumn}>
                            {item.author}
                        </span>
                        <span style={smallColumn}>
                            {item.num_comments}
                        </span>
                        <span style={smallColumn}>
                            {item.points}
                        </span>
                        <span style={smallColumn}>
                            <Button
                                onClick={() => onDelete(item.objectID)}
                                className="button-inline"
                            >
                                Delete
                            </Button>
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default Table;