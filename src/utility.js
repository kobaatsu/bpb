export function randName () {
  const nameArray = Array.from(Array(4).keys()).map(elm => {
    // 12354 - 12447
    const code = 0 | Math.random() * (12438 - 12353) + 12353
    return String.fromCharCode(code)
  })
  return nameArray.join('')
}
