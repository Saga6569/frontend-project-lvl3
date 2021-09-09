/* eslint-disable no-undef */
export const generationData = (html) => {
  const channel = html.querySelector('channel');
  const fidTitle = channel.querySelector('title').textContent;
  const fidDescription = channel.querySelector('description').textContent;
  const fids = [{ fidTitle, fidDescription }];
  const data = html.querySelector('channel');
  const cild = Array.from(data.children);
  const items = cild
    .filter((el) => el.tagName.toLowerCase() === 'item')
    .map((el) => {
      const title = el.querySelector('title').textContent.trim();
      const link = el.querySelector('link').textContent;
      return { title, link };
    });
  const result = { fids, items };
  return result;
};

export const parserData = (data) => {
  const parser = new DOMParser();
  const res = parser.parseFromString(data, 'application/xml');
  return res.activeElement.nodeName === 'parsererror' ? 'er' : res;
};

export const coorectUrl = () => {
  document.querySelector('form').reset();
  document.querySelector('.feedback').classList.remove('text-danger');
  document.querySelector('.feedback').classList.add('text-success');
  document.querySelector('.feedback').innerText = 'RSS успешно загружен';
};

export const invalidUrl = (state) => {
  const error = state.errors[0];
  document.querySelector('.feedback').classList.remove('text-success');
  document.querySelector('.feedback').classList.add('text-danger');
  document.querySelector('.feedback').innerText = error.text;
};

export const erorRss = () => {
  document.querySelector('.feedback').classList.remove('text-success');
  document.querySelector('.feedback').classList.add('text-danger');
  document.querySelector('.feedback').innerText = 'нет RSS потока';
};

export const errorRequest = () => {
  document.querySelector('.feedback').classList.remove('text-success');
  document.querySelector('.feedback').classList.add('text-danger');
  document.querySelector('.feedback').innerText = 'Ошибка запроса ';
};

export const rendering = (state) => {
  console.log(state);
  const { fids, items } = state.contener;
  console.log(fids);
  console.log(items);
  const contenerPost = document.querySelector('.posts');
  const contenerfids = document.querySelector('.feeds');
  console.log(contenerPost);
  console.log(contenerfids);
};
