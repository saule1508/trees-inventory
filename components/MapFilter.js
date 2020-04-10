import React, { Component } from 'react'
import PropTypes from 'prop-types';

class MapFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {"selected": this.props.filter}
    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.onSelect(evt.target.value === "All" ? null : evt.target.value);
  }

  render() {
    const { taxa, taxaSorted } = this.props.filters;
    const { filter } = this.state;
    const options = [(<option key="All">All</option>)];
    taxaSorted.forEach(e => {
      if (e === filter) {
        options.push(<option key={e} selected >{e}</option>);
      } else {
        options.push(<option key={e} >{e}</option>);
      }
    })
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="form-group col-md-6">
            {/* <label htmlFor="taxaSelect">Filter on taxon</label> */}
            <select className="form-control" id="taxaSelect" onChange={this.onChange}>
              {options}
            </select>
          </div>
        </div>
      </div>
    )
  }
}

MapFilter.propTypes = {
  filter: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    taxa: PropTypes.shape.isRequired,
    status: PropTypes.shape,
    rarete: PropTypes.shape
  }).isRequired
}

MapFilter.defaultProps = {
  filter: null,
  onSelect: () => { },
  filters: { taxa: [], status: [], rarete: [] }
}

  export default MapFilter
