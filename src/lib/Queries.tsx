import React from 'react';
import axios from 'axios';
import { useQuery, QueryCache, UseQueryResult, useMutation, useQueryClient, useInfiniteQuery, UseInfiniteQueryResult } from 'react-query';
import { useAuth } from '../Init';

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const queryCache = new QueryCache({
  onError: error => console.log(error)
});

export const useAccounts = (): UseQueryResult<any, unknown> => {
  const auth = useAuth();
  return useQuery(['accounts'], () => axios.get(
      `/api/accounts`,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }
    ).then((res) => {
      console.log(res);
      return res.data.records;
    })
  );
};

export const useAccount = (accountId: string): UseQueryResult<any, unknown> => {
  const auth = useAuth();
  return useQuery(['accounts', accountId], () => axios.get(
      `/api/accounts/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }
    ).then((res) => {
      console.log(res);
      return res.data.record;
    })
  );
};

export const useUpdateAccount = (accountId: string) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  return useMutation((values) => axios.put(`/api/accounts/${accountId}`, 
      values,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }).then((res) => res.data.records),
    {
      onMutate: (account: any) => {
        const oldGroup = queryClient.getQueryData(['accounts', accountId]);
        if (queryClient.getQueryData(['accounts', accountId])) {
          queryClient.setQueryData(['accounts', accountId], (old: any) => {
            return old;
          });
        }

        return () => queryClient.setQueryData(['accounts', accountId], oldGroup);
      },
      onError: (error, _newAccount, rollback: any) => {
        console.log(error);
        if (rollback) rollback();
      },
      onSettled: (account: any) => {
        queryClient.invalidateQueries(['accounts', accountId]);
      }
    }
  );
};

export const useGroups = (): UseQueryResult<any, unknown> => {
  const auth = useAuth();
  return useQuery(['groups'], () => axios.get(
      `/api/groups`,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }
    ).then((res) => {
      console.log(res);
      return res.data.records;
    })
  );
};

export const useGroup = (groupId: string) => {
  const auth = useAuth();
  const uuid = uuidv4;
  return useQuery(['groups', groupId], () => axios.get(`/api/groups/${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }
    ).then((res) => {
      console.log(res);
      return res.data.record;
    })
  );
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const uuid = uuidv4;
  return useMutation((values: any) => axios.post('/api/groups', 
      [values],
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }).then((res) => res.data.records),
    {
      onMutate: (newGroup) => {
        const oldGroups = queryClient.getQueryData(['groups']);
        if (queryClient.getQueryData(['groups'])) {
          queryClient.setQueryData(['groups'], (old: any) => {
            console.log(newGroup)
            return [...old, { id: uuid(), fields: newGroup }];
          });
        }
        return () => queryClient.setQueryData(['groups'], oldGroups);
      },
      onError: (error, _newGroup, rollback: any) => {
        console.log(error);
        if (rollback) rollback();
      },
      onSettled: () => {
        queryClient.invalidateQueries(['groups']);
      }
    }
  );
};

export const useUpdateGroup = (groupId: string) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  return useMutation((values) => axios.put(`/api/groups/${groupId}`, 
      values,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }).then((res) => res.data.records),
    {
      onMutate: (group: any) => {
        const oldGroup = queryClient.getQueryData(['groups', groupId]);
        if (queryClient.getQueryData(['groups', groupId])) {
          queryClient.setQueryData(['groups', groupId], (old: any) => {
            return old;
          });
        }

        return () => queryClient.setQueryData(['group', groupId], oldGroup);
      },
      onError: (error, _newGroup, rollback: any) => {
        console.log(error);
        if (rollback) rollback();
      },
      onSettled: (group: any) => {
        queryClient.invalidateQueries(['groups', groupId]);
      }
    }
  );
};

export const useDestroyGroup = (groupId: string) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  return useMutation(() => axios.delete(`/api/groups/${groupId}`, 
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }).then((res) => res.data.records),
    {
      onMutate: () => {
        const oldGroups = queryClient.getQueryData(['groups']);
        if (queryClient.getQueryData(['groups'])) {
          queryClient.setQueryData(['groups'], (old: any) => {
            console.log(...old.filter((o: any) => o.id !== groupId))
            return [...old.filter((o: any) => o.id !== groupId)];
          });
        }
        return () => queryClient.setQueryData(['groups'], oldGroups);
      },
      onError: (error, _newGroup, rollback: any) => {
        console.log(error);
        if (rollback) rollback();
      },
      onSettled: (group: any) => {
        queryClient.invalidateQueries(['groups', groupId]);
      }
    }
  );
};

export const useContacts = (groupId: string, filters: any): UseInfiniteQueryResult<any, unknown> => {
  const auth = useAuth();
  return useInfiniteQuery(['contacts', groupId, filters], ({ pageParam = 0 }) => axios.get(
      `/api/contacts?group_id=${groupId}&offset=${pageParam}${filters ? '&' + Object.keys(filters).map(key => key + '=' + filters[key]).join('&') : ''}`,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }
    ).then((res) => {
      return res.data.records;
    }), {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage[lastPage.length - 1]?.recordNumber ?? false
      }
    }
  )
}

export const useEmails = (filters: any): UseInfiniteQueryResult<any, unknown> => {
  const auth = useAuth();
  return useInfiniteQuery(['emails', filters], ({ pageParam = 0 }) => axios.get(
      `/api/emails?offset=${pageParam}${filters ? '&' + Object.keys(filters).map(key => key + '=' + filters[key]).join('&') : ''}`,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }
    ).then((res) => {
      return res.data.records;
    }), {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage[lastPage.length - 1]?.recordNumber ?? false
      }
    }
  )
}

export const useCreateEmail = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const uuid = uuidv4;
  return useMutation((values: any) => axios.post('/api/emails', 
      [values],
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }).then((res) => res.data.records),
    {
      onMutate: (newEmail) => {
        const newEmails = queryClient.getQueryData(['emails']);
        if (queryClient.getQueryData(['emails'])) {
          queryClient.setQueryData(['emails'], (old: any) => {
            console.log(newEmail)
            return [...old, { id: uuid(), fields: newEmail }];
          });
        }
        return () => queryClient.setQueryData(['emails'], newEmails);
      },
      onError: (error, _newEmails, rollback: any) => {
        console.log(error);
        if (rollback) rollback();
      },
      onSettled: () => {
        queryClient.invalidateQueries(['emails']);
      }
    }
  );
};

export const useUpdateEmail = (emailId: string) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  return useMutation((values) => axios.put(`/api/emails/${emailId}`, 
      values,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }).then((res) => res.data.records),
    {
      onMutate: (email: any) => {
        const oldEmail = queryClient.getQueryData(['emails', emailId]);
        if (queryClient.getQueryData(['emails', emailId])) {
          queryClient.setQueryData(['emails', emailId], (old: any) => {
            return old;
          });
        }

        return () => queryClient.setQueryData(['emails', emailId], oldEmail);
      },
      onError: (error, _newEmail, rollback: any) => {
        console.log(error);
        if (rollback) rollback();
      },
      onSettled: (email: any) => {
        queryClient.invalidateQueries(['emails', emailId]);
      }
    }
  );
};

export const useEmail = (emailId: string) => {
  const auth = useAuth();
  const uuid = uuidv4;
  return useQuery(['emails', emailId], () => axios.get(`/api/emails/${emailId}`,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }
    ).then((res) => {
      console.log(res);
      return res.data.record;
    })
  );
};

export const useDestroyEmail = (emailId: string) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  return useMutation(() => axios.delete(`/api/emails/${emailId}`, 
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }).then((res) => res.data.records),
    {
      onMutate: () => {
        const oldGroups = queryClient.getQueryData(['emails']);
        if (queryClient.getQueryData(['emails'])) {
          queryClient.setQueryData(['emails'], (old: any) => {
            console.log(...old.filter((o: any) => o.id !== emailId))
            return [...old.filter((o: any) => o.id !== emailId)];
          });
        }
        return () => queryClient.setQueryData(['emails'], oldGroups);
      },
      onError: (error, _newGroup, rollback: any) => {
        console.log(error);
        if (rollback) rollback();
      },
      onSettled: (group: any) => {
        queryClient.invalidateQueries(['emails', emailId]);
      }
    }
  );
};

export const useCreateContacts= (groupId: string) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const uuid = uuidv4;
  return useMutation((values: any) => axios.post('/api/contacts', 
      [values],
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }).then((res) => res.data.records),
    {
      onMutate: (newContact) => {
        const oldContacts = queryClient.getQueryData(['contacts']);
        if (queryClient.getQueryData(['contacts', groupId, {}])) {
          queryClient.setQueryData(['contacts', groupId, {}], (old: any) => {
            console.log(newContact, old)
            old.pages[0].push({ id: uuid(), fields: newContact, createdTime: new Date(Date.now()).toISOString() })
            console.log({
              pageParams: old.pageParams, 
              pages: [
                ...old.pages
              ]
            })
            return {
              pageParams: old.pageParams, 
              pages: [
                ...old.pages
              ]
            };
          });
        }
        return () => queryClient.setQueryData(['contacts', groupId, {}], oldContacts);
      },
      onError: (error, _newContact, rollback: any) => {
        console.log(error);
        if (rollback) rollback();
      },
      onSettled: () => {
        queryClient.invalidateQueries(['contacts', groupId, {}]);
      }
    }
  );
};

export const useUpdateContact = (emailId: string, groupId: string) => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  return useMutation((values) => axios.put(`/api/contacts/${emailId}`, 
      values,
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }).then((res) => res.data.record),
    {
      onMutate: (contact: any) => {
        const oldContact = queryClient.getQueryData(['contacts', groupId, {}]);
        return () => queryClient.setQueryData(['contacts', groupId, {}], oldContact);
      },
      onError: (error, _newContact, rollback: any) => {
        console.log(error);
        if (rollback) rollback();
      },
      onSettled: (contact: any) => {
        queryClient.invalidateQueries(['contacts', groupId, {}]);
      }
    }
  );
};

// export const useContacts = (groupId: string): UseQueryResult<any, unknown> => {
//   const auth = useAuth();
//   return useInfiniteQuery(['contacts', groupId], () => axios.get(
//       `/api/emails?group_id=
//       ${groupId}
//       ${filters ? '&' + Object.keys(filters).map(key => key + '=' + filters[key]).join('&') : ''}`,
//       {
//         headers: {
//           Authorization: `Bearer ${auth?.user?.token?.access_token}`
//         }
//       }
//     ).then((res) => {
//       console.log(res);
//       return res.data.records;
//     }), {
//       getNextPageParam: (lastPage, pages) => lastPage.nextCursor
//     }
//   )
// }