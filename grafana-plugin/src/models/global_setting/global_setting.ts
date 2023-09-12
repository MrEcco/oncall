import { action, makeObservable, observable } from 'mobx';

import BaseStore from 'models/base_store';
import { RootStore } from 'state';

import { GlobalSetting } from './global_setting.types';

export class GlobalSettingStore extends BaseStore {
  @observable.shallow
  items: { [id: string]: GlobalSetting } = {};

  @observable.shallow
  searchResult: { [key: string]: any[] } = {};

  constructor(rootStore: RootStore) {
    super(rootStore);

    this.path = '/live_settings/';

    makeObservable(this);
  }

  @action
  async updateById(id: GlobalSetting['id']) {
    const response = await this.getById(id);

    this.items = {
      ...this.items,
      [id]: response,
    };
  }

  @action
  async updateItems(query = '') {
    const results = await this.getAll();

    this.items = {
      ...this.items,
      ...results.reduce(
        (acc: { [key: number]: GlobalSetting }, item: GlobalSetting) => ({
          ...acc,
          [item.id]: item,
        }),
        {}
      ),
    };

    this.searchResult = {
      ...this.searchResult,
      [query]: results.map((item: GlobalSetting) => item.id),
    };
  }

  getSearchResult(query = '') {
    if (!this.searchResult[query]) {
      return undefined;
    }

    return this.searchResult[query].map((globalSettingId: GlobalSetting['id']) => this.items[globalSettingId]);
  }

  async getGlobalSettingItemByName(name: string) {
    const results = await this.getAll();
    return results.find((element: { name: string }) => element.name === name);
  }
}
