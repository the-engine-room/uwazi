import {db_url as dbURL} from 'api/config/database';
import request from 'shared/JSONRequest';
import translations from 'api/i18n/translations';

function saveLinksTranslations(newLinks = [], currentLinks = []) {
  let updatedTitles = {};
  let deletedLinks = [];

  currentLinks.forEach((link) => {
    let matchLink = newLinks.find((l) => l.localID === link.localID);
    if (matchLink && matchLink.title !== link.title) {
      updatedTitles[link.title] = matchLink.title;
    }
    if (!matchLink) {
      deletedLinks.push(link.title);
    }
  });

  let values = newLinks.reduce((result, link) => {
    result[link.title] = link.title;
    return result;
  }, {});

  return translations.updateContext('Menu', 'Menu', updatedTitles, deletedLinks, values);
}

function saveFiltersTranslations(_newFilters = [], _currentFilters = []) {
  let newFilters = _newFilters.filter((item) => item.items);
  let currentFilters = _currentFilters.filter((item) => item.items);

  let updatedNames = {};
  let deletedFilters = [];

  currentFilters.forEach((filter) => {
    let matchFilter = newFilters.find((l) => l.id === filter.id);
    if (matchFilter && matchFilter.name !== filter.name) {
      updatedNames[filter.name] = matchFilter.name;
    }
    if (!matchFilter) {
      deletedFilters.push(filter.name);
    }
  });

  let values = newFilters.reduce((result, filter) => {
    result[filter.name] = filter.name;
    return result;
  }, {});

  return translations.updateContext('Filters', 'Filters', updatedNames, deletedFilters, values);
}

export default {
  get() {
    return request.get(`${dbURL}/_design/settings/_view/all`)
    .then((result) => {
      if (result.json.rows.length) {
        return result.json.rows[0].value;
      }

      return {};
    });
  },

  save(settings) {
    settings.type = 'settings';

    let url = dbURL;
    if (settings._id) {
      url = `${dbURL}/_design/settings/_update/partialUpdate/${settings._id}`;
    }

    return this.get()
    .then((currentSettings) => {
      saveLinksTranslations(settings.links, currentSettings.links)
      .then(() => {
          saveFiltersTranslations(settings.filters, currentSettings.filters);
      });
      return request.post(url, settings);
    })
    .then(response => this.get(`${dbURL}/${response.json.id}`));
  }
};
