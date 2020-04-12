export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
)

// todo: use some lib? or add docs
// eslint-disable-next-line no-bitwise
export const randomColor = () => '#' + ((((1 << 24) * Math.random()) / 8) | 0).toString(16)
