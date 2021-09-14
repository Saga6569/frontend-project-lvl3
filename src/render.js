/* eslint-disable no-undef */
import {
  coorectUrl, renderError, renderingPosts, renderingFids,
} from './utilits.js';

const render = (state) => {
  if (state.processStatus === 'finiched') {
    coorectUrl();
    renderingPosts(state.contener.posts);
    renderingFids(state.contener.fids);
    return;
  }
  renderError(state);
};

export default render;
