import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {I18NLink, t} from 'app/I18N';
import {deleteTemplate, checkTemplateCanBeDeleted} from 'app/Templates/actions/templatesActions';

import {notify} from 'app/Notifications/actions/notificationsActions';

export class DocumentTypesList extends Component {

  deleteTemplate(template) {
    return this.props.checkTemplateCanBeDeleted(template)
    .then(() => {
      this.context.confirm({
        accept: () => {
          this.props.deleteTemplate(template);
        },
        title: `${t('System', 'Confirm delete document type title', 'Confirm delete document type:')} ${template.name}`,
        message: t('System', 'Confirm delete document type message', 'Are you sure you want to delete this document type?')
      });
    })
    .catch(() => {
      this.context.confirm({
        accept: () => {},
        noCancel: true,
        title: `${t('System', 'Cannot delete document type title', 'Cannot delete document type:')} ${template.name}`,
        message: t('System', 'Cannot delete document type message', 'This document type has associated documnets and cannot be deleted.')
      });
    });
  }

  render() {
    return <div className="panel panel-default">
      <div className="panel-heading">{t('System', 'Documents')}</div>
      <ul className="list-group document-types">
        {this.props.templates.toJS().map((template, index) => {
          if (template.isEntity) {
            return false;
          }
          return <li key={index} className="list-group-item">
              <I18NLink to={'/settings/documents/edit/' + template._id}>{template.name}</I18NLink>
              <div className="list-group-item-actions">
                <I18NLink to={'/settings/documents/edit/' + template._id} className="btn btn-default btn-xs">
                  <i className="fa fa-pencil"></i>&nbsp;
                  <span>{t('System', 'Edit')}</span>
                </I18NLink>
                <a onClick={this.deleteTemplate.bind(this, template)} className="btn btn-danger btn-xs template-remove">
                  <i className="fa fa-trash"></i>&nbsp;
                  <span>{t('System', 'Delete')}</span>
                </a>
              </div>
            </li>;
        })}
      </ul>
      <div className="panel-body">
        <I18NLink to="/settings/documents/new" className="btn btn-success">
          <i className="fa fa-plus"></i>
          &nbsp;
          <span>{t('System', 'Add document')}</span>
        </I18NLink>
      </div>
    </div>;
  }
}

DocumentTypesList.propTypes = {
  templates: PropTypes.object,
  deleteTemplate: PropTypes.func,
  notify: PropTypes.func,
  checkTemplateCanBeDeleted: PropTypes.func
};

DocumentTypesList.contextTypes = {
  confirm: PropTypes.func
};

export function mapStateToProps(state) {
  return {templates: state.templates};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({notify, deleteTemplate, checkTemplateCanBeDeleted}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentTypesList);
