/* eslint-disable no-return-await */
/* eslint-disable object-curly-spacing */
export default async function getImageUrl(state, index) {
  if (state.game === 'artists') {
    return await import(`../../public/asset/images/img/${index}.jpg`)
      .then((data) => data.default);
  }
  return await import(`../../public/asset/images/full/${index}full.jpg`)
    .then((data) => data.default);
}
