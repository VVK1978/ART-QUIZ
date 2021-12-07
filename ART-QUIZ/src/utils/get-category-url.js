export default async function getCategoryImagePath(state, index) {
  if (state.game === 'artists') {
    return import(`../../public/asset/images/bg/artists/${index || state.id}.webp`).then((data) => data.default);
  }
  return import(`../../public/asset/images/bg/pictures/${index || state.id}.webp`).then((data) => data.default);
}
