const generationData = (html) => {
  console.log('gen');
  console.log(html);
  const channel = html.querySelector('channel');
  const fidTitle = channel.querySelector('title').textContent;
  const fidDescription = channel.querySelector('description').textContent;
  const fid = { fidTitle, fidDescription };
  console.log(fidTitle);
  console.log(fidDescription);
  const data = html.querySelector('channel');
  const cild = Array.from(data.children);
  const items = cild
    .filter((el) => el.tagName.toLowerCase() === 'item')
    .map((el) => {
      const title = el.querySelector('title').textContent.trim();
      const link = el.querySelector('link').textContent;
      return { title, link };
    });
  const result = { fid, items };
  console.log(result);
  return result;
};

export default generationData;
