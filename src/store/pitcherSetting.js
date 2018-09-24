export default {
  type: {
    starter: 6,
    reliever: 4,
    closer: 2
  }, // 人数
  paramLimit: { // 各パラメータの数
    S: 1,
    A: 10,
    B: 18,
    C: 31,
    D: 10,
    E: 2
  },
  speed: {
    point: 150, // 振り分け
    base: 130,
    step: 2,
    max: 154,
    rules: [
      {
        min: 150,
        limit: 2
      },
      {
        equal: 130,
        limit: 3
      }
    ]
  },
  recovery: { // 回復
    point: 64,
    base: 20,
    step: 2,
    max: 28,
    rules: [
      {
        equal: 28,
        limit: 4
      },
      {
        equal: 20,
        limit: 2
      }
    ]
  }
}
