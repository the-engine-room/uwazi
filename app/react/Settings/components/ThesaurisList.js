import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {I18NLink, t} from 'app/I18N';
import {deleteThesauri, checkThesauriCanBeDeleted} from 'app/Thesauris/actions/thesaurisActions';

import {notify} from 'app/Notifications/actions/notificationsActions';

export class ThesaurisList extends Component {

  deleteThesauri(thesauri) {
    return this.props.checkThesauriCanBeDeleted(thesauri)
    .then(() => {
      this.context.confirm({
        accept: () => {
          this.props.deleteThesauri(thesauri);
        },
        title: 'Confirm delete dictionary: ' + thesauri.name,
        message: 'Are you sure you want to delete this dictionary?'
      });
    })
    .catch(() => {
      this.context.confirm({
        accept: () => {},
        noCancel: true,
        title: 'Cannot delete dictionary: ' + thesauri.name,
        message: 'This dictionary is being used in document types and cannot be deleted.'
      });
    });
  }

  render() {
    return <div className="panel panel-default">
      <div className="panel-heading">{t('System', 'Dictionaries')}</div>
      <ul className="list-group relation-types">
        {this.props.dictionaries.toJS().map((dictionary, index) => {
          return <li key={index} className="list-group-item">
              <I18NLink to={'/settings/dictionaries/edit/' + dictionary._id}>{dictionary.name}</I18NLink>
              <div className="list-group-item-actions">
                <I18NLink to={'/settings/dictionaries/edit/' + dictionary._id} className="btn btn-default btn-xs">
                  <i className="fa fa-pencil"></i>&nbsp;
                  <span>{t('System', 'Edit')}</span>
                </I18NLink>
                <a onClick={this.deleteThesauri.bind(this, dictionary)} className="btn btn-danger btn-xs template-remove">
                  <i className="fa fa-trash"></i>&nbsp;
                  <span>{t('System', 'Delete')}</span>
                </a>
              </div>
            </li>;
        })}
      </ul>
      <div className="panel-body">
        <I18NLink to="/settings/dictionaries/new" className="btn btn-success">
          <i className="fa fa-plus"></i>
          &nbsp;
          <span>{t('System', 'Add dictionary')}</span>
        </I18NLink>
      </div>
    </div>;
  }
}

ThesaurisList.propTypes = {
  dictionaries: PropTypes.object,
  deleteThesauri: PropTypes.func,
  notify: PropTypes.func,
  checkThesauriCanBeDeleted: PropTypes.func
};

ThesaurisList.contextTypes = {
  confirm: PropTypes.func
};

export function mapStateToProps(state) {
  return {dictionaries: state.dictionaries};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({notify, deleteThesauri, checkThesauriCanBeDeleted}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ThesaurisList);
