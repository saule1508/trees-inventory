import React, { Component } from 'react'
import PropTypes from 'prop-types';

class MapFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {"selected": this.props.filter}
    this.onChange = this.onChange.bind(this);
    this.onProjection = this.onProjection.bind(this);
  }

  onChange(evt) {
    this.props.onSelect(evt.target.value === "All" ? null : evt.target.value);
  }
  
  onProjection(evt){
    this.props.onProjectionChange(evt.target.value);
  }

  render() {
    const { taxa, taxaSorted } = this.props.filters;
    const { filter, projection } = this.state;
    const options = [(<option key="All">All</option>)];
    taxaSorted.forEach(e => {
      if (e === filter) {
        options.push(<option key={e} selected >{e}</option>);
      } else {
        options.push(<option key={e} >{e}</option>);
      }
    })
    let optionProjections = [];
    if (this.props.projection === '31370'){
      optionProjections = [(<option key={0} value='31370' selected >Irisnet</option>),(<option key={1} value='3857'>Open Street Map</option>)];
    } else {
      optionProjections = [(<option key={0} value='31370' >Irisnet</option>),(<option key={1} selected value='3857'>Open Street Map</option>)];
    }
    return (
      <div className="row">
        <div className="col-md-12">
          <form>
            <div className="form-group row">
              <div className="col-md-3">
                <label htmlFor="taxaSelect">Filter on taxon</label>
                <select className="form-control" id="taxaSelect" onChange={this.onChange}>
                  {options}
                </select>
              </div>
              <div className="col-md-1">
                <label htmlFor="projectSelect">Choose Map</label>
                <select className="form-control" id="projectSelect" onChange={this.onProjection}>
                  {optionProjections}
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

MapFilter.propTypes = {
  filter: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onProjectionChange: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    taxa: PropTypes.shape().isRequired,
    taxaSorted: PropTypes.array.isRequired,
    status: PropTypes.shape(),
    rarete: PropTypes.shape()
  }).isRequired
}

MapFilter.defaultProps = {
  filter: null,
  onSelect: () => { },
  onProjectionChange: () => { },
  filters: { taxa: [], taxaSorted: [], status: [], rarete: [] }
}

  export default MapFilter
