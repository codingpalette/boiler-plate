// **** 초기상태 정의
const initialState = {
  name: '',
  phone: '',
  smsNumber: '',
  id: '',
  userCheck: false,
  userLogin: false,
  appLoading: false,
};

// **** 액션 타입 정의

export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

function users(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        ...state,
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
      };
    case USER_LOGIN_FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
}

export default users;
