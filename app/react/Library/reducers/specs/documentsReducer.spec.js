import Immutable from 'immutable';
import * as types from 'app/Library/actions/actionTypes';

import documentsReducer from 'app/Library/reducers/documentsReducer';
import 'jasmine-immutablejs-matchers';

describe('documentsReducer', () => {
  const initialState = Immutable.fromJS({rows: []});

  describe('when state is undefined', () => {
    it('returns initial', () => {
      let newState = documentsReducer();
      expect(newState).toEqual(initialState);
    });
  });

  describe('SET_DOCUMENTS', () => {
    it('should set the documents in the state', () => {
      let documents = [{title: 'Song of Ice and Fire: The Winds of Winter'}, {title: 'Song of Ice and Fire: A Dream of Spring'}];
      let newState = documentsReducer(initialState, {type: types.SET_DOCUMENTS, documents});

      expect(newState).toEqualImmutable(Immutable.fromJS(documents));
    });
  });

  describe('LIBRARY/UPDATE_DOCUMENT', () => {
    it('should set the documents in the state', () => {
      let currentState = Immutable.fromJS({rows: [{title: '1', _id: 1}, {title: '2', _id: 2}]});
      let newState = documentsReducer(currentState, {type: types.UPDATE_DOCUMENT, doc: {_id: 2, title: 'new title'}});

      expect(newState.toJS()).toEqual({rows: [{title: '1', _id: 1}, {title: 'new title', _id: 2}]});
    });
  });
});
