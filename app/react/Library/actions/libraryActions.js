import * as types from 'app/Library/actions/actionTypes';
import api from 'app/Library/DocumentsAPI';

export function enterLibrary() {
  return {type: types.ENTER_LIBRARY};
}

export function showFilters() {
  return {type: types.SHOW_FILTERS};
}

export function hideFilters() {
  return {type: types.HIDE_FILTERS};
}

export function setDocuments(documents) {
  return {type: types.SET_DOCUMENTS, documents};
}

export function setTemplates(templates, thesauris) {
  return {type: types.SET_TEMPLATES, templates, thesauris};
}

export function setSearchTerm(searchTerm) {
  return {type: types.SET_SEARCHTERM, searchTerm};
}

export function setPreviewDoc(docId) {
  return {type: types.SET_PREVIEW_DOC, docId};
}

export function setSuggestions(suggestions) {
  return {type: types.SET_SUGGESTIONS, suggestions};
}

export function hideSuggestions() {
  return {type: types.HIDE_SUGGESTIONS};
}

export function showSuggestions() {
  return {type: types.SHOW_SUGGESTIONS};
}

export function setOverSuggestions(boolean) {
  return {type: types.OVER_SUGGESTIONS, hover: boolean};
}

export function searchDocuments(searchTerm, filters) {
  return (dispatch) => {
    return api.search(searchTerm, filters)
    .then((documents) => {
      dispatch(setDocuments(documents));
      dispatch(hideSuggestions());
    });
  };
}

export function getSuggestions(searchTerm) {
  return (dispatch) => {
    return api.getSuggestions(searchTerm)
    .then((suggestions) => {
      dispatch(setSuggestions(suggestions));
      dispatch(showSuggestions());
    });
  };
}
