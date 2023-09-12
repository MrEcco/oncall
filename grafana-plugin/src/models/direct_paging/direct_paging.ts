import { Alert } from 'models/alertgroup/alertgroup.types';
import BaseStore from 'models/base_store';
import { makeRequest } from 'network';
import { RootStore } from 'state';

import { ManualAlertGroupPayload } from './direct_paging.types';
import { makeObservable } from 'mobx';

export class DirectPagingStore extends BaseStore {
  constructor(rootStore: RootStore) {
    super(rootStore);

    this.path = '/direct_paging/';

    makeObservable(this);
  }

  async createManualAlertRule(data: ManualAlertGroupPayload) {
    return await makeRequest(`${this.path}`, {
      method: 'POST',
      data,
    }).catch(this.onApiError);
  }

  async updateAlertGroup(alertId: Alert['pk'], data: ManualAlertGroupPayload) {
    return await makeRequest(`${this.path}`, {
      method: 'POST',
      data: {
        alert_group_id: alertId,
        ...data,
      },
    }).catch(this.onApiError);
  }
}
