import database from "./database";
import HistoryItem from "./types/HistoryItem";
import { HistoryFilter } from "./state";
import { Collection, Table } from "dexie";
import _ from "lodash";
import { legacyRequestToHistoryItem } from "./historyUtil";

export const HISTORY_SEARCH_LIMIT = 100;

const LEGACY_HISTORY_KEY = "JaSON.history";
const MAX_HISTORY_SIZE = 1000;

const isEmpty = (historyFilter: HistoryFilter): boolean => {
  return historyFilter.searchTerm.length === 0 && !historyFilter.showFavourites;
};

const applyShowFavourites = (table: Table<HistoryItem, string>, showFavourites: boolean) => {
  return showFavourites ? table.where({ favourite: 1 }) : table.toCollection();
};

const applySearchTerm = (collection: Collection<HistoryItem, string>, searchTerm: string) => {
  if (searchTerm.length > 0) {
    const parts = searchTerm.toLowerCase().split(/\s+/);
    const terms: string[] = [];
    parts.forEach((part) => {
      if (!_.includes(terms, part)) {
        terms.push(part);
      }
    });

    // filter by search term
    if (terms.length > 0) {
      collection = collection.and((historyItem: HistoryItem) => {
        return _.every(terms, (term) => {
          return historyItem.searchableText.includes(term);
        });
      });
    }
  }
  return collection;
};

const applyCommonFilters = (collection: Collection<HistoryItem, string>) => {
  return collection.limit(HISTORY_SEARCH_LIMIT).reverse().sortBy("date");
};

const historyService = {
  save: (historyItem: HistoryItem, callback: () => void) => {
    database.history.add(historyItem).then(callback);
  },

  delete: (historyItem: HistoryItem, callback: () => void) => {
    database.history.delete(historyItem.id).then(callback);
  },

  update: (historyItem: HistoryItem, updates: {}, callback: () => void) => {
    database.history.update(historyItem.id, updates).then(callback);
  },

  clear: (callback: () => void) => {
    database.history.clear().then(callback);
  },

  trim: (callback: () => void) => {
    database.history.count(async (count) => {
      // include a buffer of 50 records so we don't trim history every time
      if (count > MAX_HISTORY_SIZE + 50) {
        const keysToDelete = await database.history.orderBy("date").reverse().offset(MAX_HISTORY_SIZE).primaryKeys();
        await database.history.bulkDelete(keysToDelete);
        callback();
      }
    });
  },

  search: (historyFilter: HistoryFilter, callback: (results: HistoryItem[]) => void) => {
    if (isEmpty(historyFilter)) {
      database.history.orderBy("date").reverse().limit(HISTORY_SEARCH_LIMIT).toArray(callback);
    } else {
      const { searchTerm, showFavourites } = historyFilter;
      let query = applyShowFavourites(database.history, showFavourites);
      query = applySearchTerm(query, searchTerm);
      applyCommonFilters(query).then(callback);
    }
  },

  migrate: (callback: () => void) => {
    const historyString = localStorage.getItem(LEGACY_HISTORY_KEY);
    if (historyString) {
      console.debug("Attempting to migrate legacy JaSON history");
      const start = Date.now();
      const itemsToSave: HistoryItem[] = [];
      try {
        const historyItems: any[] = JSON.parse(historyString);
        _.forEach(historyItems, (historyItem) => {
          if (itemsToSave.length >= MAX_HISTORY_SIZE) {
            return false;
          }
          const item = legacyRequestToHistoryItem(historyItem.request);
          if (item) {
            itemsToSave.push(item);
          }
        });
      } catch (e) {
        console.debug("Error migrating history: %s", e.message);
      } finally {
        database.history.bulkAdd(itemsToSave).then(() => callback());
        console.debug("History migration took %sms", Date.now() - start);
        localStorage.removeItem(LEGACY_HISTORY_KEY);
      }
    }
  },
};

export default historyService;
