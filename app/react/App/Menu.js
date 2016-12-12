import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {NeedAuthorization} from 'app/Auth';
import {toUrlParams} from '../../shared/JSONRequest';
import {I18NLink, I18NMenu, t} from 'app/I18N';
import {processFilters} from 'app/Library/actions/libraryActions';

class Menu extends Component {

  libraryUrl() {
    const params = processFilters(this.props.search, this.props.filters.toJS());
    return '/library/' + toUrlParams(params);
  }

  render() {
    const {links} = this.props;
    const user = this.props.user.toJS();

    const navLinks = links.map(link =>
      <li key={link.get('localID')} className="menuNav-item">
        <I18NLink to={link.get('url') || '/'} className="btn menuNav-btn">{t('Menu', link.get('title'))}</I18NLink>
      </li>
    );

    return (
      <ul onClick={this.props.onClick} className={this.props.className}>
        <li className="menuItems">
          <ul className="menuNav-list">{navLinks}</ul>
        </li>
        <li className="menuActions">
          <ul className="menuNav-list">
            <li className="menuNav-item">
              <I18NLink to={this.libraryUrl()} className="menuNav-btn btn btn-default">
                  <i className="fa fa-th"></i>
              </I18NLink>
            </li>
            <NeedAuthorization>
              <li className="menuNav-item">
                <I18NLink to='/uploads' className="menuNav-btn btn btn-default">
                  <span><i className="fa fa-cloud-upload"></i></span>
                </I18NLink>
              </li>
            </NeedAuthorization>
            <NeedAuthorization>
              <li className="menuNav-item">
                <I18NLink to='/settings/account' className="menuNav-btn btn btn-default">
                  <i className="fa fa-cog"></i>
                </I18NLink>
              </li>
            </NeedAuthorization>
            {(() => {
              if (!user._id) {
                return (
                  <li className="menuNav-item">
                    <I18NLink to='/login' className="menuNav-btn btn btn-default">
                      <i className="fa fa-power-off"></i>
                    </I18NLink>
                  </li>
                );
              }
            })()}
          </ul>
          <I18NMenu location={this.props.location}/>
        </li>
      </ul>
    );
  }
}

Menu.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  search: PropTypes.object,
  filters: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  searchDocuments: PropTypes.func,
  links: PropTypes.object
};

export function mapStateToProps({user, search, settings, library}) {
  return {
    user,
    search,
    filters: library.filters,
    links: settings.collection.get('links')};
}

export default connect(mapStateToProps)(Menu);
