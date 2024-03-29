/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import axios from 'axios';
import _ from 'lodash';

export const generationData = (html) => {
  const channel = html.querySelector('channel');
  const fidTitle = channel.querySelector('title').textContent;
  const fidDescription = channel.querySelector('description').textContent;
  const fids = [{ fidTitle, fidDescription }];
  const data = html.querySelector('channel');
  const cild = Array.from(data.children);
  const posts = cild
    .filter((el) => el.tagName.toLowerCase() === 'item')
    .map((el) => {
      const title = el.querySelector('title').textContent.trim();
      const link = el.querySelector('link').textContent;
      const description = el.querySelector('description').textContent;
      return {
        title, link, description,
      };
    });
  return { fids, posts };
};

export const parserData = (data) => {
  const parser = new DOMParser();
  const result = parser.parseFromString(data, 'application/xml');
  return result.documentElement.tagName === 'parsererror' ? 'er' : result;
};

export const renderingMessage = (status, contener) => {
  if (status === 'finiched') {
    contener.classList.add('text-success');
    contener.classList.remove('text-danger');
  } else if (status === 'failed') {
    contener.classList.add('text-danger');
    contener.classList.remove('text-success');
  }
};

export const renderHeadlines = () => {
  const contenerPost = document.querySelector('.posts');
  if (contenerPost.querySelector('.card-title') === null) {
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body-0';
    cardBody.innerHTML = '<h2 class="card-title h4">Посты</h2>';
    contenerPost.append(cardBody);
    const listGroup = document.createElement('ul');
    listGroup.className = 'class="list-group border-0 rounded-0';
    contenerPost.append(listGroup);
  }
  const contenerfids = document.querySelector('.feeds');
  if (contenerfids.querySelector('.card-title') === null) {
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body-0';
    cardBody.innerHTML = '<h2 class="card-title h4">Фиды</h2>';
    contenerfids.append(cardBody);
    const listGroup = document.createElement('ul');
    listGroup.className = 'class="list-group border-0 rounded-0';
    contenerfids.append(listGroup);
  }
};

export const renderingPosts = (post) => {
  const listGroup = document.querySelector('.posts > ul');
  const li = document.createElement('li');
  const id = _.uniqueId();
  li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
  li.innerHTML = `<a href="${post.link}" class="fw-bold" data-id="${id}" target="_blank" rel="noopener noreferrer">${post.title}</a>
    <button type="button" class="btn btn-outline-primary btn-sm" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
  li.querySelector('button').addEventListener('click', () => {
    document.querySelector('.modal-title').innerHTML = `${post.title}`;
    document.querySelector('.modal-body').innerHTML = `${post.description}`;
    li.querySelector('a').className = 'fw-normal';
    document.querySelector('.modal-footer > a').setAttribute('href', post.link);
  });
  return listGroup.append(li);
};

export const renderingFids = (fids) => {
  const listGroup = document.querySelector('.feeds > ul');
  const li = document.createElement('li');
  return fids.map((fid) => {
    li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    li.innerHTML = `<li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${fid.fidTitle}</h3><p class="m-0 small text-black-50">${fid.fidDescription}</p></li>`;
    return listGroup.append(li);
  });
};

export const router = async (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`);

export const updatePost = async (state) => {
  const contenerPost = document.querySelector('.posts > .rounded-0');
  const arrUrl = state.successfulAdded;
  const arrItems = Array.from(contenerPost.children);
  const text = arrItems.map((el) => el.firstChild.textContent);
  return arrUrl.map(async (url) => {
    const response = await router(url);
    const data = parserData(response.data.contents);
    const PostsFids = generationData(data);
    const arrPosts = PostsFids.posts;
    return arrPosts.map((el) => {
      if (!text.includes(el.title)) {
        console.log('совпадение');
        return renderingPosts(el);
      }
      console.log('нет совпадений');
    });
  });
};

export const formLock = (processStatus, input, buttonForm) => {
  if (processStatus === 'during') {
    buttonForm.setAttribute('disabled', 'disabled');
    input.setAttribute('readonly', 'readonly');
    return;
  }
  buttonForm.removeAttribute('disabled');
  input.removeAttribute('readonly');
};
