export const ErrorStates = {
  BACKEND_FAIL: 'BACKEND_FAIL',
  END_OF_LIST: 'END_OF_LIST',
};

export const ErrorData = {
  [ErrorStates.BACKEND_FAIL]: {
    title: "Server Error!",
    imageUrl: '/backend-fail.webp',
    description: 'Please try again later, while we work on fixing this.'
  },
  [ErrorStates.END_OF_LIST]: {
    title: "You've reached the end of the list!",
    imageUrl: '/end-of-list.webp',
    description: 'Please try playing the other modes or switching difficulty settings.'
  },
};
