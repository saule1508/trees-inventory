import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withTranslation } from '../i18n';
import { Button, Input, Form, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';

class MapFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {"filters": this.props.filters}
    this.onChange = this.onChange.bind(this);
  }

  onChange(selectedOption, which) {
    const newFilter = {};
    newFilter[which.name] = selectedOption;
    console.log(`On change of ${which.name}`);
    console.log(selectedOption);
    console.log({...this.props.filters, ...newFilter});
    this.props.onSelect({...this.props.filters, ...newFilter});
  }

  render() {
    const { taxa, status, rarete } = this.props;
    const { filters } = this.props;
    const { language } = this.props.i18n;
    /*
    const allLabel = language === 'fr' ? 'Tous' : 'Allemaal' ;
    const taxaOptions = [(<option key="All">{allLabel}</option>)];
    taxa.forEach(e => {
      if (e === filter) {
        taxaOptions.push(<option key={e} selected >{e}</option>);
      } else {
        taxaOptions.push(<option key={e} >{e}</option>);
      }
    })
    */
    const taxaOptions = taxa.map((e) => ({value: e, label: e}));
    const statusOptions = Object.keys(status).map(k => {
      const parts=k.split('-');
      const label = language === 'nl' ? parts[2] : parts[1]; 
      return {value: parts[0], label: label};
    })
    const rareteOptions = Object.keys(rarete).map(k => (
      {value: k, label: k === "null" ? "NA" : k}));
    return (
      <div className="row">
        <div className="col-md-12">
          <Form>
            <div className="form-row">
              
              <div className="form-group col-md-4">
                <Label for="taxa">Taxon</Label>
                <Select defaultValue={filters.taxa} 
                  onChange={this.onChange}
                  name="taxa"
                  isClearable
                  options={taxaOptions} />
              </div>
              
              <div className="form-group col-md-4">
                <Label for="status">Status</Label>
                <Select  
                  className="basic-multi-select" 
                  isMulti
                  name="status"
                  onChange={this.onChange}
                  options={statusOptions}
                />
              </div>
              <div className="form-group col-md-4">
                <Label for="rareteSelect">Rarete</Label>
                <Select 
                  name="rarete" 
                  isMulti
                  onChange={this.onChange}
                  options={rareteOptions}
                /> 
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

MapFilter.propTypes = {
  filters: PropTypes.shape({
    taxa: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    status: PropTypes.array,
    rarete: PropTypes.array
  }),
  onSelect: PropTypes.func.isRequired,
  taxa: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  rarete: PropTypes.object.isRequired,
  t: PropTypes.func,
  i18n: PropTypes.object
}

MapFilter.defaultProps = {
  filters: {taxa: {value: null, label: null}, status: [], rarete: []},
  onSelect: () => { },
  taxa: [],
  status: {},
  rarete: {}
}

export default withTranslation()(MapFilter)
