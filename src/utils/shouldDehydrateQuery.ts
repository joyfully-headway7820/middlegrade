export const shouldDehydrateQuery = (query: {
  state: { data: unknown };
}) => query.state.data !== undefined;
