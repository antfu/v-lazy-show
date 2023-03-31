import type { VNode } from 'vue'
import { vShow, withDirectives } from 'vue'

const KEY_PREFIX = '_vLazyShowKey_'

export function withLazyShow(vnode: VNode, condition: any, key: string, ctx: any) {
  if (condition || ctx[KEY_PREFIX + key]) {
    ctx[KEY_PREFIX + key] = true
    return withDirectives(vnode, [[vShow, condition]])
  }
  return null
}
