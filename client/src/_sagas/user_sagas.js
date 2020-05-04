import { all, fork, call, put, takeLatest } from 'redux-saga/effects';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
} from '../_reducers/user_reducer';

/// **************** ////

function userLoginAPI(userphone) {
  // return axios.post('/api/user/check', { userphone });
}

function* userLogin(action) {
  try {
    // console.log(action);
    const res = yield call(userLoginAPI, action.data);
    yield put({
      type: USER_LOGIN_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: USER_LOGIN_FAILURE,
      error: e,
    });
  }
}

function* watchUserLogin() {
  yield takeLatest(USER_LOGIN_REQUEST, userLogin);
}

/// **************** ////

export default function* userSaga() {
  yield all([fork(watchUserLogin)]);
}
