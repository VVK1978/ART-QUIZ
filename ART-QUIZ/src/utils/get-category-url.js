export default async function getCategoryImagePath(state) {
  let url = '';
  if (state.gameTitle === 'Художники') {
    url = await import(`../../public/asset/images/bg/artists/${state.id}.webp`).then((data) => data.default);
  }
  url = await import(`../../public/asset/images/bg/pictures/${state.id}.webp`).then((data) => data.default);
  return url;
}
