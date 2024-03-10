/* for custom error handling, where the system itself doesn't throw an error but we need to in the moment */
export const errorHandler = (statusCode, message) => {
  /* we don't have an error 'cause the system doesn't throw one, so we have to create one ourself using the Error constructor  */
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
