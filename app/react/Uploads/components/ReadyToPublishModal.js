import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Modal from 'app/Layout/Modal';

import {hideModal} from 'app/Modals/actions/modalActions';
import {moveToLibrary, finishEdit} from 'app/Uploads/actions/uploadsActions';

export class ReadyToPublishModal extends Component {

  confirm() {
    this.props.finishEdit();
    this.props.hideModal('readyToPublish');
    this.props.moveToLibrary(this.props.doc.toJS());
  }

  edit() {
    this.props.hideModal('readyToPublish');
  }

  render() {
    if (!this.props.doc) {
      return <div />;
    }

    let doc = this.props.doc.toJS();

    return (
      <Modal isOpen={!!doc} type="success">

        <Modal.Body>
          <p>Congratulations! The selected document is ready to be public:</p>
          <p><strong>{doc.title}</strong></p>
        </Modal.Body>

        <Modal.Footer>
          <button type="button" className="btn btn-default cancel-button" onClick={() => this.props.hideModal('readyToPublish') }>
            <i className="fa fa-close"></i> Cancel
          </button>
          <button type="button" className="btn btn-success confirm-button" onClick={() => this.confirm()}>
            <i className="fa fa-paper-plane"></i> Publish document
          </button>
        </Modal.Footer>

      </Modal>
    );
  }
}

ReadyToPublishModal.propTypes = {
  hideModal: PropTypes.func,
  moveToLibrary: PropTypes.func,
  finishEdit: PropTypes.func,
  doc: PropTypes.object
};

const mapStateToProps = (state) => {
  return {doc: state.modals.get('readyToPublish')};
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({hideModal, moveToLibrary, finishEdit}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadyToPublishModal);
