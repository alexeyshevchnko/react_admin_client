// src/dataProvider.ts
import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import { DataProvider } from 'react-admin'; 

//const apiUrl = 'https://njj6h14m-3001.euw.devtunnels.ms/api';
const apiUrl = 'http://localhost:3001/api'; 

const httpClient = fetchUtils.fetchJson;

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
        const { page = 1, perPage = 10 } = params.pagination || {};
        const { field = 'id', order = 'ASC' } = params.sort || {};
        
         // Обработка для выводов TON
/////////////
          if (resource === 'ton_withdraw') {
              const hasWallet = params.filter?.hasWallet;
              if(!hasWallet){ 
                  return {
                    data:[],
                    total: 0
                };
              }

              const userId = params.filter?.user_id;
              if (!userId) throw new Error('user_id is required for ton_withdraw');
              
              const url = `${apiUrl}/users/${userId}/ton/withdrawals`;
              const { json } = await httpClient(url);
              
              return {
                  data: json.map((item: any) => ({
                      ...item,
                      id: item._id || item.transaction_id
                  })),
                  total: json.length
              };
          }
          if (resource === 'ton_deposit') {
              const hasWallet = params.filter?.hasWallet;
              if(!hasWallet){
                  return {
                    data:[],
                    total: 0
                };
              }
              
              const userId = params.filter?.user_id;
              if (!userId) throw new Error('user_id is required for ton_deposit');

              const url = `${apiUrl}/users/${userId}/ton/deposits`;
              const { json } = await httpClient(url);

              return {
                  data: json.map((item: any) => ({
                      ...item,
                      id: item._id || item.txHash
                  })),
                  total: json.length
              };
          }

          if (resource === 'ton_summary') {
              const userId = params.filter?.user_id;
              if (!userId) throw new Error('user_id is required for ton_summary');

              const url = `${apiUrl}/users/${userId}/ton/summary`;
              const { json } = await httpClient(url);

              return {
                  data: {
                      id: userId,
                      ...json
                  }
              };
          }

///////////////
if (resource === 'market_buyer') {
    const userId = params.filter?.user_id;
    if (!userId) throw new Error('user_id is required for market_buyer');

    const url = `${apiUrl}/market/buyer/${userId}`;
    const { json } = await httpClient(url);

    return {
        data: Array.isArray(json) ? json.map((item: any) => ({
            ...item,
            id: item._id || item.id
        })) : [],
        total: Array.isArray(json) ? json.length : 0
    };
}

if (resource === 'market_salesman') {
    const userId = params.filter?.user_id;
    if (!userId) throw new Error('user_id is required for market_salesman');

    const url = `${apiUrl}/market/salesman/${userId}`;
    const { json } = await httpClient(url);

    return {
        data: Array.isArray(json) ? json.map((item: any) => ({
            ...item,
            id: item._id || item.id
        })) : [],
        total: Array.isArray(json) ? json.length : 0
    };
}


        if (resource === 'manufacture_user') {
          const userId = params.filter?.user_id;
          if (!userId) throw new Error('user_id is required for manufacture_user');
          
          const query = {
              filter: JSON.stringify({ user_id: userId }),
              ...(params.pagination && {
                  range: JSON.stringify([
                      (params.pagination.page - 1) * params.pagination.perPage,
                      params.pagination.page * params.pagination.perPage - 1
                  ])
              }),
              ...(params.sort && {
                  sort: JSON.stringify([params.sort.field, params.sort.order])
              })
          };
          
          const url = `${apiUrl}/${resource}?${stringify(query)}`; 
          
          try {
              const { json, headers } = await httpClient(url); 
              
              return {
                  data: Array.isArray(json) ? json : [],
                  total: parseInt(headers.get('content-range')?.split('/').pop() || '0', 10)
              };
          } catch (error) {
              console.error('API error:', error);
              throw error;
          }
      }

     if (resource === 'coinage_user') {
        const userId = params.filter?.user_id;
        if (!userId) throw new Error('user_id is required');

        const url = `${apiUrl}/coinage_user/${userId}`; // ← тут путь с userId
        const response = await httpClient(url);

        if (Array.isArray(response.json.data)) {
          return {
            data: [],
            total: 0
          };
        }

        return {
          data: Array.isArray(response.json) ? response.json : [response.json],
          total: Array.isArray(response.json) ? response.json.length : 1
        };
      }

      

       

        // Стандартная обработка для других ресурсов
        const query = {
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            sort: JSON.stringify([field, order]),
            filter: JSON.stringify(params.filter || {})
        };
        
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        const { json, headers } = await httpClient(url);

        return {
            data: json.map((item: any) => ({
                ...item,
                id: item._id || item.ID || item.id
            })),
            total: parseInt(headers.get('content-range')?.split('/').pop() || '0', 10)
        };
    },

    getOne: async (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`;
        const { json } = await httpClient(url);
        
        return {
            data: {
                ...json,
                id: json._id || json.ID || json.id
            }
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