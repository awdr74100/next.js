import {
  HTML_LIMITED_BOT_UA_RE_STRING,
  isOversizedUserAgent,
} from '../../shared/lib/router/utils/is-bot'
import { NON_JS_BOT_UA_RE } from '../../shared/lib/router/utils/non-js-bots'

let cachedPattern: string | undefined
let cachedRegex: RegExp | undefined

export function shouldServeStreamingMetadata(
  userAgent: string,
  htmlLimitedBots: string | undefined
): boolean {
  // No real UA string exceeds this bound, so oversized UAs are not bots we need
  // to identify; skip the (possibly user-configured) regex on them entirely.
  if (!userAgent || isOversizedUserAgent(userAgent)) {
    return true
  }
  const pattern = htmlLimitedBots || HTML_LIMITED_BOT_UA_RE_STRING
  if (cachedPattern !== pattern) {
    cachedPattern = pattern
    cachedRegex = new RegExp(pattern, 'i')
  }
  // Only block metadata for HTML-limited bots
  if (cachedRegex!.test(userAgent)) {
    return false
  }
  return true
}

export function shouldDisableProgressiveLoading(
  userAgent: string,
  nonJsBots: RegExp | undefined
): boolean {
  // No real UA string exceeds this bound, so oversized UAs are not bots we need
  // to identify; skip the (possibly user-configured) regex on them entirely.
  if (!userAgent || isOversizedUserAgent(userAgent)) {
    return false
  }
  return (nonJsBots ?? NON_JS_BOT_UA_RE).test(userAgent)
}
