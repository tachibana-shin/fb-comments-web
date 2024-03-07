#fb-comments-web

This package is the result of reverse analysis of embedding Facebook Comment Plugin (FCP) into my website.
I was using `FCP` on my website [AnimeVsub](https://github.com/anime-vsub/desktop-web) and I realized that FCP uses too many resources. While the main thread is only using `32MB` of RAM, `FCP` is using `>200MB` of RAM which is unacceptable. And finally I decompiled `FCP` to get its most core APIs and implemented it into an API

## Usage

```ts
import { FBCommentPlugin } from "fb-comments-web"

const commentsPlugin = new FBCommentPlugin({
  // config
})
```

```ts
interface FBCommentPluginConfig {
  href: string
  limit?: number
  locale: string
  order_by?: "time" | "reverse_time"
  pluginUrl?: string
  /** @description {string} url require starts with "https://" or "http://" */
  app: string
  sdk?: string
  version?: string
  fetch?: (
    url: string,
    options?: {
      method: string
      headers: Record<string, string>
      body: URLSearchParams
    }
  ) => Promise<string>
}
declare class FBCommentPlugin {
  #private
  static readonly default_config: Partial<FBCommentPluginConfig>
  constructor(config: FBCommentPluginConfig)
  private _setup
  setup(): Promise<{
    headers: {
      "content-type": string
      dpr: string
      pragma: string
      "sec-ch-prefers-color-scheme": string
      "sec-ch-ua": string
      "sec-ch-ua-full-version-list": string
      "sec-ch-ua-mobile": string
      "sec-ch-ua-platform": string
      "sec-ch-ua-platform-version": string
      "sec-gpc": string
      "viewport-width": string
      "x-asbd-id": string
      "x-fb-lsd": string
      Referer: string
      "Referrer-Policy": string
    }
    targetID: string
    app_id: string
    limit: string
    __a: string
    __req: string
    __hs: string
    dpr: string
    __ccg: string
    __rev: string
    __s: string
    __hsi: string
    __dyn: string
    __csr: string
    locale: string
    lsd: string
    jazoest: string
    __sp: string
    after_cursor: string
    fb_dtsg: string
    comments: DefaultComments
  }>
  getComments(after_cursor?: string): Promise<AsyncComments>
  getMoreComments(
    commentID: string,
    after_cursor?: string
  ): Promise<AsyncComments>
  postCommentToMain(text: string): Promise<PostComment>
  replyComment(commentID: string, text: string): Promise<PostComment>
  likeComment(commentID: string, isLike: boolean): Promise<PostComment>
  editCommit(commentID: string, text: string): Promise<PostComment>
  removeComment(commentID: string): Promise<RemoveComment>
}
```
