/* eslint-disable no-undef */
import {
  renderingPosts, renderingFids, renderHeadlines,
} from './utilits.js';

const render = (state) => {
  console.log('вызвали рендер');
  if (state.processStatus === 'finiched') {
    coorectUrl();
    renderHeadlines();
    (state.contener.posts).map((el) => renderingPosts(el));
    renderingFids(state.contener.fids);
    return;
  }
  renderError(state);
};

export default render;
