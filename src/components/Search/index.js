import React, {Component} from 'react';

class Search extends Component {
    componentDidMount() {
        this.input.focus();
    }

    render() {
        const {value, onChange, children, onSubmit} = this.props;

        return (<form onSubmit={onSubmit}>
            {children}
            <input
                type="text"
                onChange={onChange}
                value={value}
                ref={(node) => { this.input = node; }}
            />
            <button type="submit">
                {children}
            </button>
        </form>);
    }
}


export default Search;