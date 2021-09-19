/* eslint-disable no-undef */
import {
  coorectUrl, renderError, renderingPosts, renderingFids, renderHeadlines,
} from './utilits.js';

const render = (state) => {
  if (state.processStatus === 'finiched') {
    coorectUrl();
    renderHeadlines();
    renderingPosts(state.contener.posts);
    renderingFids(state.contener.fids);
    state.contener.fids = [];
    state.contener.posts = [];
    return;
  }
  renderError(state);
};

export default render;
