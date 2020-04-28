import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

export const fetchUser = () => async dispatch => {
  // redux thunk allows us to control when we want to dispatch the action
  // we only dispatch the action after the axios req is completed
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data }); //get user model with user id
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token); // pass stripe token to BE server
  dispatch({ type: FETCH_USER, payload: res.data }); //get user model back with updated credits
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);

  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data }); //receive updated user model with deducted credits
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: FETCH_SURVEYS, payload: res.data }); //payload will be an array that contains all the surveys user has created
};
