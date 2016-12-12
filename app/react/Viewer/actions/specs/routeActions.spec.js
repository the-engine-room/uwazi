import {APIURL} from 'app/config.js';
import backend from 'fetch-mock';
import referencesUtils from 'app/Viewer/utils/referencesUtils';

import * as routeActions from '../routeActions';

describe('Viewer routeActions', () => {
  let document = {_id: '1', title: 'title', pdfInfo: 'test'};
  let templates = {rows: [{name: 'Decision', _id: 'abc1', properties: []}, {name: 'Ruling', _id: 'abc2', properties: []}]};
  let thesauris = {rows: [{name: 'countries', _id: '1', values: []}]};
  let relationTypes = {rows: [{name: 'Supports', _id: '1'}]};
  let references = [{_id: '1', connectedDocument: '1'}, {_id: '2', connectedDocument: '2'}];

  beforeEach(() => {
    backend.restore();
    backend
    .mock(APIURL + 'documents?_id=documentId', 'GET', {body: JSON.stringify({rows: [document]})})
    .mock(APIURL + 'templates', 'GET', {body: JSON.stringify(templates)})
    .mock(APIURL + 'thesauris', 'GET', {body: JSON.stringify(thesauris)})
    .mock(APIURL + 'relationtypes', 'GET', {body: JSON.stringify(relationTypes)})
    .mock(APIURL + 'references/by_document/documentId', 'GET', {body: JSON.stringify(references)});

    spyOn(referencesUtils, 'filterRelevant').and.returnValue(['filteredReferences']);
  });

  describe('requestViewerState', () => {
    it('should request for the document passed, the thesauris and return an object to populate the state', (done) => {
      routeActions.requestViewerState('documentId', 'es')
      .then((state) => {
        let documentResponse = state.documentViewer.doc;
        let templatesResponse = state.documentViewer.templates;
        let thesaurisResponse = state.documentViewer.thesauris;
        let relationTypesResponse = state.documentViewer.relationTypes;

        expect(documentResponse._id).toBe('1');
        expect(templatesResponse).toEqual(templates.rows);
        expect(thesaurisResponse).toEqual(thesauris.rows);
        expect(relationTypesResponse).toEqual(relationTypes.rows);

        expect(state.relationTypes).toEqual(relationTypes.rows);

        expect(state.templates).toEqual(templates.rows);
        expect(state.thesauris).toEqual(thesauris.rows);
        done();
      })
      .catch(done.fail);
    });

    it('should filter the relevant language and by-source references', (done) => {
      routeActions.requestViewerState('documentId', 'es')
      .then((state) => {
        let referencesResponse = state.documentViewer.references;

        expect(referencesUtils.filterRelevant).toHaveBeenCalledWith(references, 'es');
        expect(referencesResponse).toEqual(['filteredReferences']);
        done();
      })
      .catch(done.fail);
    });
  });

  describe('setViewerState()', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = jasmine.createSpy('dispatch');
      routeActions.setViewerState({
        documentViewer:
        {
          doc: 'doc',
          references: 'references',
          templates: 'templates',
          thesauris: 'thesauris',
          relationTypes: 'relationTypes'
        },
        relationTypes: 'relationTypes'
      })(dispatch);
    });

    it('should call setTemplates with templates passed', () => {
      expect(dispatch).toHaveBeenCalledWith({type: 'relationTypes/SET', value: 'relationTypes'});
      expect(dispatch).toHaveBeenCalledWith({type: 'SET_REFERENCES', references: 'references'});
      expect(dispatch).toHaveBeenCalledWith({type: 'viewer/doc/SET', value: 'doc'});
      expect(dispatch).toHaveBeenCalledWith({type: 'viewer/templates/SET', value: 'templates'});
      expect(dispatch).toHaveBeenCalledWith({type: 'viewer/thesauris/SET', value: 'thesauris'});
      expect(dispatch).toHaveBeenCalledWith({type: 'viewer/relationTypes/SET', value: 'relationTypes'});

      expect(dispatch).toHaveBeenCalledWith({type: 'templates/SET', value: 'templates'});
      expect(dispatch).toHaveBeenCalledWith({type: 'thesauris/SET', value: 'thesauris'});
    });
  });
});
