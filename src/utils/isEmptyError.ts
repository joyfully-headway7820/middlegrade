export const isEmptyError = (query: {
  isError: boolean;
  data: unknown;
}) => query.isError && query.data == null;
