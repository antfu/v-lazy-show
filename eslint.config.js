// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'test/**/output.*.*',
    ],
  },
  {
    rules: {
      // overrides
    },
  },
)
