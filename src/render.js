/* eslint-disable no-undef */
import {
  coorectUrl, invalidUrl, erorRss, errorRequest, rendering,
} from './utilits.js';

const render = (state) => {
  if (state.registrationForm.status === 'correct') {
    coorectUrl();
    rendering(state);
    return;
  }
  if (state.registrationForm.status === 'invalid') {
    invalidUrl(state);
    return;
  }
  if (state.registrationForm.status === 'rss') {
    erorRss();
    return;
  }
  if (state.registrationForm.status === 'RequestError') {
    errorRequest();
  }
};

export default render;
