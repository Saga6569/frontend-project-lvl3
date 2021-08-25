/* eslint-disable no-undef */
const render = (state) => {
  console.log('render');
  console.log(state);
  if (state.registrationForm.status === 'correct') {
    console.log('ссылка рабочая можно делать запрос');
    document.querySelector('form').reset();
    document.querySelector('.feedback').classList.remove('text-danger');
    document.querySelector('.feedback').classList.add('text-success');
    document.querySelector('.feedback').innerText = 'RSS успешно загружен';
    return;
  }
  const error = state.errors[0];
  console.log('ошибка отрисовываем');
  if (error.type === 'url') {
    document.querySelector('.feedback').classList.remove('text-success');
    document.querySelector('.feedback').classList.add('text-danger');
    document.querySelector('.feedback').innerText = error.text;
  }
};

export default render;
