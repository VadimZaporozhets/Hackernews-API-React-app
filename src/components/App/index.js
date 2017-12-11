import React, {Component} from 'react';
import Table from '../Table';
import Button from '../Button';
import Search from '../Search';
import fetch from 'isomorphic-fetch';
import {DEFAULT_QUERY, DEFAULT_HPP} from '../../constants';

import './index.css';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null,
            isLoading: false,
            sortKey: 'NONE',
            isSortingReversed: false,
        };

        this.setSearchItems = this.setSearchItems.bind(this);
        this.shouldSearchItemsUpdate = this.shouldSearchItemsUpdate.bind(this);
        this.fetchSearchItems = this.fetchSearchItems.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSort = this.onSort.bind(this);
    }

    onSort(sortKey) {
        const isSortingReversed = this.state.sortKey === sortKey
            && !this.state.isSortingReversed;
        this.setState({sortKey, isSortingReversed});
    }

    setSearchItems(result) {
        const {hits, page} = result;
        const {searchKey, results} = this.state;

        const oldHits = results && results[searchKey]
            ? results[searchKey].hits
            : [];

        const updatedHits = [
            ...oldHits,
            ...hits
        ]

        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page},
            },
            isLoading: false
        });
    }

    shouldSearchItemsUpdate(searchTerm) {
        return !this.state.results[searchTerm];
    }

    fetchSearchItems(searchTerm, page = 0) {
        this.setState({isLoading: true});
        const url = `https://hn.algolia.com/api/v1/search?query=${searchTerm}&page=${page}&hitsPerPage=${DEFAULT_HPP}`;

        fetch(url)
            .then(response => response.json())
            .then(result => this.setSearchItems(result))
            .catch(e => this.setState({error: e}));
    }

    componentDidMount() {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        this.fetchSearchItems(searchTerm);
    }

    onDelete = (id) => {
        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];

        const filterId = (item) => {
            return item.objectID !== id;
        };

        const updatedHits = hits.filter(filterId);

        this.setState({
            results: {
                ...results,
                [searchKey]: {
                    hits: updatedHits,
                    page
                }
            }
        });
    }

    onSearchSubmit(event) {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});

        if (this.shouldSearchItemsUpdate(searchTerm)) {
            this.fetchSearchItems(searchTerm);
        }

        event.preventDefault();
    }

    onSearchChange(event) {
        this.setState({
            searchTerm: event.target.value
        });
    }

    render() {
        const {results, searchTerm, searchKey, error, isLoading, sortKey, isSortingReversed} = this.state;
        const page = (results && results[searchKey] && results[searchKey].page) || 0;
        const list = (results && results[searchKey] && results[searchKey].hits) || [];
        const ButtonWithLoading = withLoading(Button);

        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                </div>
                {error
                    ? <div className="interactions">
                        <p>Something went wrong.</p>
                    </div>
                    : <Table
                        isSortingReversed={isSortingReversed}
                        sortKey={sortKey}
                        onSort={this.onSort}
                        list={list}
                        onDelete={this.onDelete}
                    />
                }
                <div className="interactions">
                    <ButtonWithLoading
                        isLoading={isLoading}
                        onClick={() => {this.fetchSearchItems(searchKey, page + 1)}}>
                        More
                    </ButtonWithLoading>
                </div>
            </div>
        );
    }
}

const withLoading = (Component) => ({isLoading, ...rest}) =>
    isLoading
        ? <p>Loading...</p>
        : <Component {...rest}/>

export default App;
