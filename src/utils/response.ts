
export function getErrorMessage(error: any, login = false): string {
  console.log(error.response);
    if (error.status === 401) {
      if (login) return 'Username or password invalid';
      if (typeof error.response?.data == 'string') return error.response?.data;
      return 'You have to be authenticated to perform this action !';
    }
    else if (error.status === 400) {
      if (typeof error.response?.data == 'string') return error.response?.data;
      return 'Invalid data provided !';
    }
      else if (error.status === 0) {
      return 'Unable to connect to the server. Please check your network connection and try again.';
    } else {
      return 'An unexpected error occurred. Please try again later.';
    }
}