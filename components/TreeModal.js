import React from 'react';
import PropTypes from 'prop-types';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { throws } from 'assert';

const TreeModal = (props) => {
  const { values } = props; 
  if (! values){
    return null;
  }
  const rows = [];
  Object.keys(values).forEach((k)=>{
    if (k !== 'geometry'){
      rows.push((<tr key={values["ID_ARBRE_CMS"]}>
        <td key={1}>{k}</td><td key={2}>{values[k]}</td>
      </tr>))
    }
  })
  return (
    <React.Fragment>
    <div>
      <Modal isOpen={props.isOpen} toggle={props.onClose} >
        <ModalHeader toggle={props.onClose}>{values["TAX_LA"]}</ModalHeader>
        <ModalBody>
          <div className="row lieninventaire">
            <div className="col-md-12">
            <a target="_BLANK" href={`http://arbres-inventaire.irisnet.be/tree.php?id=${values['ID_ARBRE_CMS']}`}>Lien vers l'inventaire</a>
            </div>
          </div>
          <table className="table table-sm">
            <thead>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={props.onClose}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
    <style jsx>{`
      .lieninventaire {
        margin-top: 10px;
        margin-bottom: 10px;
      }
    `}</style>
    </React.Fragment>
  );
}

TreeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
}
TreeModal.defaultProps = {
  onClose : () => {},
  isOpen: false,
  values: {}
}

export default TreeModal