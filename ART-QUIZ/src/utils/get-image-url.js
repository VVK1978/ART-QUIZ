export default async function getImageUrl(state, index) {
  let url = '';
  if (state.gameTitle === 'Художники') {
    url = await import(`../../public/asset/images/img/${state.imagePosition + index}.jpg`)
      .then((data) => data.default);
  } else {
    url = await import(`../../public/asset/images/full/${state.imagePosition + index}full.jpg`)
      .then((data) => data.default);
  }
  return url;
}
