export const defaultCollection = {
  collection: [],
  totalCount: 0,
};

export const collectionOffsetLimitPagination = () => {
  return {
    keyArgs: [],
    merge: (existing = defaultCollection, incoming = defaultCollection) => {
      if (!existing) {
        return incoming;
      }
      return {
        ...incoming,
        collection: [...existing.collection, ...incoming.collection],
      };
    },
  };
};
