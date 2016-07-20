import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import ContextMenu from 'app/ContextMenu';

import {loadDefaultViewerMenu, resetDocumentViewer} from '../actions/documentActions';
import SourceDocument from './SourceDocument';
import TargetDocument from './TargetDocument';
import CreateReferencePanel from './CreateReferencePanel';
import ViewReferencesPanel from './ViewReferencesPanel';
import ViewMetadataPanel from './ViewMetadataPanel';

import ViewerDefaultMenu from './ViewerDefaultMenu';
import ViewerTextSelectedMenu from './ViewerTextSelectedMenu';
import ViewerSaveReferenceMenu from './ViewerSaveReferenceMenu';
import ViewerSaveTargetReferenceMenu from './ViewerSaveTargetReferenceMenu';
import MetadataPanelMenu from './MetadataPanelMenu';
import ConfirmCloseForm from './ConfirmCloseForm';
import ConfirmCloseReferenceForm from './ConfirmCloseReferenceForm';
import {actions} from 'app/BasicReducer';
import Footer from 'app/App/Footer';

export class Viewer extends Component {

  componentDidMount() {
    this.context.store.dispatch(loadDefaultViewerMenu());
  }

  componentWillUnmount() {
    this.context.store.dispatch(resetDocumentViewer());
    this.context.store.dispatch(actions.unset('viewer/doc'));
    this.context.store.dispatch(actions.unset('viewer/docHTML'));
    this.context.store.dispatch(actions.unset('viewer/targetDoc'));
    this.context.store.dispatch(actions.unset('viewer/targetDocHTML'));
  }

  render() {
    let className = 'document-viewer';
    if (this.props.panelIsOpen) {
      className = 'document-viewer with-panel is-active';
    }
    if (this.props.targetDoc) {
      className = 'document-viewer show-target-document is-active';
    }

    return (
      <div className="row">
        <main className={className}>
          <div className="main-wrapper">
            <SourceDocument />
            <TargetDocument />
            <Footer/>
          </div>
        </main>

        <ConfirmCloseForm />
        <ConfirmCloseReferenceForm />
        <CreateReferencePanel />
        <ViewReferencesPanel />
        <ViewMetadataPanel />

        <ContextMenu>
          <ViewerDefaultMenu/>
          <ViewerTextSelectedMenu/>
          <ViewerSaveReferenceMenu/>
          <ViewerSaveTargetReferenceMenu/>
          <MetadataPanelMenu/>
        </ContextMenu>
      </div>
    );
  }

}

Viewer.propTypes = {
  panelIsOpen: PropTypes.bool,
  targetDoc: PropTypes.bool
};

Viewer.contextTypes = {
  store: PropTypes.object
};

const mapStateToProps = ({documentViewer}) => {
  let uiState = documentViewer.uiState.toJS();
  return {
    panelIsOpen: !!uiState.panel,
    targetDoc: !!documentViewer.targetDoc.get('_id')
  };
};

export default connect(mapStateToProps)(Viewer);
