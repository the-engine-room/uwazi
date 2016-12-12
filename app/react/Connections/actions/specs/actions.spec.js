import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import referencesAPI from 'app/Viewer/referencesAPI';
import api from 'app/utils/api';
import {mockID} from 'shared/uniqueID.js';
import * as notificationsTypes from 'app/Notifications/actions/actionTypes';

import * as actions from '../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Connections actions', () => {
  let store;
  const getState = () => {
    return {locale: 'es'};
  };

  beforeEach(() => {
    mockID();
    store = mockStore({});
    spyOn(api, 'get').and.returnValue(Promise.resolve({json: {rows: [{type: 'entity'}, {type: 'doc'}]}}));
    spyOn(referencesAPI, 'save').and.returnValue(Promise.resolve('newReference'));
  });

  describe('Search-related actions', () => {
    describe('immidiateSearch', () => {
      it('should search for connections', () => {
        actions.immidiateSearch(store.dispatch, 'term');
        expect(api.get).toHaveBeenCalledWith('search', {searchTerm: 'term', fields: ['doc.title']});
        expect(store.getActions()).toContain({type: 'SEARCHING_CONNECTIONS'});
      });

      it('should set the results upon response', (done) => {
        actions.immidiateSearch(store.dispatch, 'term')
        .then(() => {
          const expectedAction = {type: 'connections/searchResults/SET', value: [{type: 'entity'}, {type: 'doc'}]};
          expect(store.getActions()).toContain(expectedAction);
          done();
        });
      });

      it('should not include entities if targetRanged', (done) => {
        actions.immidiateSearch(store.dispatch, 'term', 'targetRanged')
        .then(() => {
          expect(store.getActions()).toContain({type: 'connections/searchResults/SET', value: [{type: 'doc'}]});
          done();
        });
      });
    });

    describe('search', () => {
      it('should update the state searchTerm and debounce server searching the term', () => {
        jasmine.clock().install();

        actions.search('term', 'basic')(store.dispatch);
        expect(store.getActions()).toContain({type: 'connections/searchTerm/SET', value: 'term'});
        expect(api.get).not.toHaveBeenCalled();

        jasmine.clock().tick(400);

        expect(api.get).toHaveBeenCalledWith('search', {searchTerm: 'term', fields: ['doc.title']});
        jasmine.clock().uninstall();
      });
    });
  });

  describe('startNewConnection', () => {
    it('should perform an immediate empty search', () => {
      actions.startNewConnection('type', 'sourceId')(store.dispatch);
      expect(api.get).toHaveBeenCalledWith('search', {searchTerm: '', fields: ['doc.title']});
    });

    it('should restore default search term and open the panel', (done) => {
      actions.startNewConnection('type', 'souceId')(store.dispatch)
      .then(() => {
        expect(store.getActions()).toContain({type: 'connections/searchTerm/SET', value: ''});
        expect(store.getActions()).toContain({type: 'OPEN_CONNECTION_PANEL', sourceDocument: 'souceId', connectionType: 'type'});
        done();
      });
    });
  });

  describe('setRelationType', () => {
    it('should broadcast the new connection type', () => {
      expect(actions.setRelationType('newType')).toEqual({type: 'SET_RELATION_TYPE', relationType: 'newType'});
    });
  });

  describe('setTargetDocument', () => {
    it('should broadcast the id of the target', () => {
      expect(actions.setTargetDocument('targetId')).toEqual({type: 'SET_TARGET_DOCUMENT', id: 'targetId'});
    });
  });

  describe('saveConnection', () => {
    let connection;

    beforeEach(() => {
      connection = {sourceDocument: 'sourceId', type: 'basic'};
    });

    it('should set the creating flag to true and attempt to save the connection', () => {
      actions.saveConnection(connection)(store.dispatch, getState);
      expect(store.getActions()).toEqual([{type: 'CREATING_CONNECTION'}]);
      expect(referencesAPI.save).toHaveBeenCalledWith({sourceDocument: 'sourceId'});
    });

    it('should attempt to save the connection with language if not basic', () => {
      connection.type = 'ranged';
      actions.saveConnection(connection)(store.dispatch, getState);
      expect(store.getActions()).toEqual([{type: 'CREATING_CONNECTION'}]);
      expect(referencesAPI.save).toHaveBeenCalledWith({sourceDocument: 'sourceId', language: 'es'});
    });

    it('should broadcast the created connection, execute the callback and broadcast success', (done) => {
      const callback = jasmine.createSpy('callback');
      actions.saveConnection(connection, callback)(store.dispatch, getState)
      .then(() => {
        expect(store.getActions()).toContain({type: 'CONNECTION_CREATED', connection: 'newReference'});
        expect(callback).toHaveBeenCalledWith('newReference');
        expect(store.getActions()).toContain({
          type: notificationsTypes.NOTIFY,
          notification: {message: 'saved successfully !', type: 'success', id: 'unique_id'}
        });
        done();
      })
      .catch(done.fail);
    });
  });

  describe('selectRangedTarget', () => {
    it('should broadcast CREATING_RANGED_CONNECTION and execute callback with target id', () => {
      const callback = jasmine.createSpy('callback');
      actions.selectRangedTarget({targetDocument: 'targetId'}, callback)(store.dispatch);
      expect(store.getActions()).toContain({type: 'CREATING_RANGED_CONNECTION'});
      expect(callback).toHaveBeenCalledWith('targetId');
    });
  });
});
