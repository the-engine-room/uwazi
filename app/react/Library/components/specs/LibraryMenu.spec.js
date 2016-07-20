import React from 'react';
import {shallow} from 'enzyme';

import {LibraryMenu} from 'app/Library/components/LibraryMenu';
import {MenuButtons} from 'app/ContextMenu';
import Immutable from 'immutable';

describe('LibraryMenu', () => {
  let component;
  let props;

  let render = () => {
    component = shallow(<LibraryMenu {...props}/>);
  };

  beforeEach(() => {
    props = {
      showFilters: jasmine.createSpy('showFilters'),
      searchDocuments: jasmine.createSpy('searchDocuments'),
      loadDocument: jasmine.createSpy('loadDocument'),
      filtersForm: {isBatman: {value: true}},
      templates: Immutable.fromJS([]),
      searchTerm: 'test',
      search: {sort: 'title'}
    };
  });

  describe('when filtersPanel is hidden', () => {
    it('should showFilters on click', () => {
      render();
      component.find(MenuButtons.Main).simulate('click');
      expect(props.showFilters).toHaveBeenCalled();
    });
  });

  describe('when there is a document selected', () => {
    it('should start editing it', () => {
      props.selectedDocument = Immutable.fromJS({_id: '123'});
      props.docForm = Immutable.fromJS({_id: '123'});

      render();
      component.find(MenuButtons.Main).simulate('click');
      expect(props.loadDocument).toHaveBeenCalled();
    });
  });
});
