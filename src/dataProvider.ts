import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import { DataProvider } from 'react-admin';
import { API_URL } from './config';

const apiUrl = API_URL;
const httpClient = fetchUtils.fetchJson;

interface AnalyticsDayRangeId {
  collectionName: string;
  userId: string;
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field = 'id', order = 'ASC' } = params.sort || {};

    const filter = params.filter || {};

    if (resource === 'oldMail') {
      const userId = filter.userId;
      if (!userId) throw new Error('userId is required in filter');

      const url = `${apiUrl}/users/${userId}/old-mail?page=${page}&limit=${perPage}`;
      const response = await fetch(url);
      const result = await response.json();

      return {
        data: result.mail.map((item: any, index: number) => ({
          id: item.ID || index,
          ...item,
        })),
        total: result.total,
      };
    }

    if (resource === 'analytics_collections') {
      const response = await fetch(`${API_URL}/analytics/collections`);
      const data = await response.json();

      return {
        data: data.collections.map((name: string, index: number) => ({
          id: index,
          name,
        })),
        total: data.collections.length,
      };
    }

    if (resource === 'analytics_logs') {
      try {
        const { collectionName, userId, minDay, maxDay } = filter;
        if (!collectionName || !userId || minDay == null || maxDay == null) {
          throw new Error('Missing required filter parameters');
        }

        const query = new URLSearchParams({
          collectionName: String(collectionName),
          userId: String(userId),
          minDay: String(minDay),
          maxDay: String(maxDay),
        });

        const response = await fetch(`${API_URL}/analytics/logs?${query}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        let logs = [];

        if (data.logs && Array.isArray(data.logs)) logs = data.logs;
        else if (Array.isArray(data)) logs = data;
        else if (data.flatLogs && Array.isArray(data.flatLogs)) logs = data.flatLogs;

        return {
          data: logs.map((log: any, index: number) => ({
            id: index,
            ...log,
            LOG: log.LOG?.map((item: any, itemIndex: number) => ({
              ...item,
              id: `${index}-${itemIndex}`,
            })) || [],
          })),
          total: logs.length,
        };
      } catch (error) {
        console.error('Error in analytics_logs dataProvider:', error);
        return { data: [], total: 0 };
      }
    }

    if (resource === 'user-deposits') {
      const userId = filter.userId;
      if (!userId) throw new Error('userId filter is required for user-deposits');

      const url = `${apiUrl}/user-deposits/${userId}`;
      const { json } = await httpClient(url);

      return {
        data: json.map((item: any) => ({ ...item, id: item._id })),
        total: json.length,
      };
    }

    if (resource === 'buyerTrolleys' && filter.buyer_user_id) {
      const response = await fetch(`${apiUrl}/trolleys/buyer/${filter.buyer_user_id}`);
      const json = await response.json();
      const start = (page - 1) * perPage;
      const end = start + perPage;

      return {
        data: json.data.slice(start, end).map((item: any) => ({
          ...item,
          id: item._id,
        })),
        total: json.data.length,
      };
    }

    if (resource === 'salesmanTrolleys' && filter.salesman_user_id) {
      const response = await fetch(`${apiUrl}/trolleys/salesman/${filter.salesman_user_id}`);
      const json = await response.json();
      const start = (page - 1) * perPage;
      const end = start + perPage;

      return {
        data: json.data.slice(start, end).map((item: any) => ({
          ...item,
          id: item._id,
        })),
        total: json.data.length,
      };
    }

    if (resource === 'user_trolleys_by_type') {
      const userId = filter.user_id;
      const typeId = filter.type_id;
      if (!userId || !typeId) throw new Error('user_id и type_id обязательны для user_trolleys_by_type');

      const url = `${apiUrl}/trolleys/getTrolleysByType?userId=${userId}&typeId=${typeId}`;
      const { json } = await httpClient(url);

      return {
        data: json.map((item: any) => ({ ...item, id: item._id || item.id })),
        total: json.length,
      };
    }

    if (resource === 'trolleys_grouped') {
      const userId = filter.user_id;
      if (!userId) throw new Error('user_id is required for trolleys_grouped');

      const url = `${apiUrl}/trolleys/getTrolleysGrouped/${userId}`;
      const { json } = await httpClient(url);

      return {
        data: json.map((item: any) => ({
          ...item,
          id: item.id || item._id,
          user_id: userId,
        })),
        total: json.length,
      };
    }

    if (['tools', 'tools_salesman', 'tools_buyer'].includes(resource)) {
      const userId = filter.user_id;
      if (!userId) throw new Error('user_id is required');

      let url = '';
      if (resource === 'tools') url = `${apiUrl}/tools/getTools/${userId}`;
      if (resource === 'tools_salesman') url = `${apiUrl}/tools/salesman/${userId}`;
      if (resource === 'tools_buyer') url = `${apiUrl}/tools/buyer/${userId}`;
      url += `?page=${page}&limit=${perPage}&_sort=${field}&_order=${order}`;

      const { json } = await httpClient(url);

      return {
        data: json.data.map((item: any) => ({
          ...item,
          id: item._id || item.id,
        })),
        total: json.total,
      };
    }

    if (resource === 'ton_withdraw' || resource === 'ton_deposit') {
      if (!filter.hasWallet) return { data: [], total: 0 };

      const userId = filter.user_id;
      if (!userId) throw new Error(`user_id is required for ${resource}`);

      const path = resource === 'ton_withdraw' ? 'withdrawals' : 'deposits';
      const url = `${apiUrl}/users/${userId}/ton/${path}`;
      const { json } = await httpClient(url);

      return {
        data: json.map((item: any) => ({
          ...item,
          id: item._id || item.transaction_id || item.txHash,
        })),
        total: json.length,
      };
    }

    if (resource === 'ton_summary') {
      const userId = filter.user_id;
      if (!userId) throw new Error('user_id is required for ton_summary');

      const url = `${apiUrl}/users/${userId}/ton/summary`;
      const { json } = await httpClient(url);

      return {
        data: {
          id: userId,
          ...json,
        },
        total: 1,
      };
    }

    if (resource === 'market_buyer' || resource === 'market_salesman' || resource === 'market_shophistory') {
      const userId = filter.user_id;
      if (!userId) throw new Error(`user_id is required for ${resource}`);

      const map = {
        market_buyer: 'buyer',
        market_salesman: 'salesman',
        market_shophistory: 'shophistory',
      };
      const url = `${apiUrl}/market/${map[resource]}/${userId}`;
      const { json } = await httpClient(url);

      return {
        data: Array.isArray(json) ? json.map((item: any) => ({
          ...item,
          id: item._id || item.id,
        })) : [],
        total: Array.isArray(json) ? json.length : 0,
      };
    }

    if (resource === 'manufacture_user') {
      const userId = filter.user_id;
      if (!userId) throw new Error('user_id is required for manufacture_user');

      const query = {
        filter: JSON.stringify({ user_id: userId }),
        ...(params.pagination && {
          range: JSON.stringify([
            (page - 1) * perPage,
            page * perPage - 1,
          ]),
        }),
        ...(params.sort && {
          sort: JSON.stringify([field, order]),
        }),
      };

      const url = `${apiUrl}/${resource}?${stringify(query)}`;
      const { json, headers } = await httpClient(url);

      return {
        data: Array.isArray(json) ? json : [],
        total: parseInt(headers.get('content-range')?.split('/').pop() || '0', 10),
      };
    }

    if (resource === 'coinage_user') {
      const userId = filter.user_id;
      if (!userId) throw new Error('user_id is required');

      const url = `${apiUrl}/coinage_user/${userId}`;
      const response = await httpClient(url);

      return {
        data: Array.isArray(response.json) ? response.json : [response.json],
        total: Array.isArray(response.json) ? response.json.length : 1,
      };
    }

    const query = {
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      sort: JSON.stringify([field, order]),
      filter: JSON.stringify(filter),
    };

    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { json, headers } = await httpClient(url);

    return {
      data: json.map((item: any) => ({
        ...item,
        id: item._id || item.ID || item.id,
      })),
      total: parseInt(headers.get('content-range')?.split('/').pop() || '0', 10),
    };
  },
    getOne: async (resource, params) => {
    if (resource === 'analytics_day_range') {
    let collectionName: string;
    let userId: string;

    if (typeof params.id === 'string') {
      const parts = params.id.split(':');
      collectionName = parts[0];
      userId = parts[1];
    } else {
      collectionName = (params.id as unknown as AnalyticsDayRangeId).collectionName;
      userId = (params.id as unknown as AnalyticsDayRangeId).userId;
    }

    return httpClient(`${apiUrl}/analytics/day-range?collectionName=${collectionName}&userId=${userId}`)
      .then(({ json }) => ({
        data: {
          id: params.id,  // id должен быть внутри data
          ...json,
        },
      }));
  }
  // Стандартный путь: GET /resource/:id
  const url = `${API_URL}/${resource}/${params.id}`;
  const response = await fetch(url);
  const json = await response.json();

  return {
    data: {
      ...json,
      id: json._id || json.ID || json.id,
    },
  };
},


  getMany: async (resource, params) => {
    const query = { filter: JSON.stringify({ id: params.ids }) };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { json } = await httpClient(url);
    return { data: json.map((item: any) => ({ ...item, id: item.ID || item._id || item.id })) };
  },
 

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    
    const query = {
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      sort: JSON.stringify([field, order]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { headers, json } = await httpClient(url);

    return {
      data: json.map((item: any) => ({
        ...item,
        id: item.ID || item._id || item.id,
      })),
      total: parseInt(headers.get('content-range')?.split('/').pop() || '0', 10),
    };
  },

  create: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: {
        ...json,
        id: json.ID || json._id || json.id,
      },
    }));
  },

  update: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: {
        ...json,
        id: json.ID || json._id || json.id,
      },
    }));
  },

  updateMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map(id =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        })
      )
    );

    return { data: responses.map(({ json }) => json.id) };
  },

  delete: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({
      data: {
        ...json,
        id: json.ID || json._id || json.id,
      },
    }));
  },

  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map(id =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'DELETE',
        })
      )
    );

    return { data: params.ids };
  },
};