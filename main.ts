import { parseRT } from "./logic/parse-rt.ts"
import { AsyncComments } from "./types/AsyncComments.ts"
import { DefaultComments } from "./types/DefaultComments.ts"
import { PostComment } from "./types/PostComment.ts"
import { RemoveComment } from "./types/RemoveComment.ts"

export interface FBCommentPluginConfig {
  href: string
  limit?: number
  locale: string
  order_by?: "time" | "reverse_time"
  pluginUrl?: string
  /** @description {string} url require starts with "https://" or "http://" */
  app: string // https://app.animevsub.eu.org
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
export class FBCommentPlugin {
  static readonly default_config: Partial<FBCommentPluginConfig> = {
    limit: 10,
    order_by: "reverse_time",
    pluginUrl: "https://www.facebook.com/plugins",
    sdk: "joey",
    version: "v15.0",
    fetch: (url, options) => fetch(url, options).then((res) => res.text())
  }
  readonly #config: Required<FBCommentPluginConfig>

  constructor(config: FBCommentPluginConfig) {
    this.#config = Object.assign(
      {},
      FBCommentPlugin.default_config,
      config
    ) as Required<FBCommentPluginConfig>
  }

  #setup_return?: Awaited<ReturnType<typeof this._setup>>

  private async _setup() {
    const url = `${this.#config.pluginUrl}/feedback.php`
    const queries = {
      app_id: "",
      channel: `https://staticxx.facebook.com/x/connect/xd_arbiter/?version=46#cb=fc971c42bd70c0003&domain=${
        new URL(this.#config.app).hostname
      }&is_canvas=false&origin=https%3A%2F%2F${
        this.#config.app
      }%2Ffbaf0c74572724fba&relation=parent.parent`,
      color_scheme: "light",
      container_width: "973",
      height: "100",
      href: this.#config.href,
      lazy: "false",
      locale: this.#config.locale,
      numposts: this.#config.limit + "",
      order_by: this.#config.order_by,
      sdk: this.#config.sdk,
      version: this.#config.version,
      width: ""
    }

    const mainUrl = `${url}?${new URLSearchParams(queries)}`
    const html = await this.#config.fetch(mainUrl)

    // ============= parse =============

    const targetID = html.match(/"targetID":"(\d+)"/)?.[1]

    const app_id = html.match(/"appID":"(\d+)"/)?.[1]
    const limit = html.match(/numposts=(\d+)/)?.[1] ?? this.#config.limit + ""
    // TODO: custom
    // const __user = 0; //100024588752208//0;
    const __a = "1"
    const __req = "1" // is index request
    const __hs = html.match(/"haste_session"\:"([^"]+)"/)?.[1]
    const dpr = "1"
    const __ccg = "GOOD"
    const __rev = html.match(/"client_revision":(\d+)/)?.[1]
    // TODO: ::8rhvxd
    const __s = ""
    const __hsi = html.match(/"hsi":"(\d+)"/)?.[1]
    const __dyn = ""
    const __csr = ""
    // TODO: custom
    const locale = html.match(/"locale":"(\w+)"/)?.[1] ?? this.#config.locale
    const lsd = html.match(/"LSD",\[\],{"token":"([^"]+)"/)?.[1]
    const jazoest = ""
    const __sp = "1"
    const after_cursor = html.match(/"afterCursor":"([^"]+)"/)?.[1]
    const fb_dtsg = html.match(/"DTSGInitData",\[\],{"token":"([^"]+)"/)?.[1]

    const comments = JSON.parse(
      html.slice(
        (html.lastIndexOf('"props"') >>> 0) + 8,
        (html.lastIndexOf('"placeholderElement"') >>> 0) - 1
      )
    ) as DefaultComments

    if (
      targetID === undefined ||
      app_id === undefined ||
      __hs === undefined ||
      __rev === undefined ||
      __hsi === undefined ||
      lsd === undefined
    ) {
      throw new Error("Can't resolve setup because lost params.")
    }

    const headers = {
      "content-type": "application/x-www-form-urlencoded",
      dpr: "1",
      pragma: "no-cache",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua":
        '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      "sec-ch-ua-full-version-list":
        '"Chromium";v="122.0.6261.112", "Not(A:Brand";v="24.0.0.0", "Google Chrome";v="122.0.6261.112"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-ch-ua-platform-version": '"15.0.0"',
      "sec-gpc": "1",
      "viewport-width": "727",
      "x-asbd-id": "129477",
      "x-fb-lsd": "AVoje5w3t28",
      // "cookie": "ps_n=0; datr=LU3cZSRNCYxxCm3eYkMh7iNr; sb=-NziZdme__APuhzWxH_97M-g; locale=vi_VN; wd=1366x708; c_user=100024588752208; xs=36%3AMZY_PwWr2vVraw%3A2%3A1709738073%3A-1%3A7867; fr=0boOOKHOSrwgP7dTy.AWX7fKQ_lLJsv4f1XDkgHzo3eYM.Bl4tz4..AAA.0.0.Bl6Iha.AWWUC1Wpi5s; SL_G_WPT_TO=vi",
      // "cookie": "ps_n=0; wd=1366x679; datr=LU3cZSRNCYxxCm3eYkMh7iNr; sb=-NziZdme__APuhzWxH_97M-g; fr=0boOOKHOSrwgP7dTy..Bl4tz4..AAA.0.0.Bl5zwq.AWU6WFSUyeM; SL_G_WPT_TO=vi",
      Referer: mainUrl,
      "Referrer-Policy": "origin-when-cross-origin"
    }

    const data = {
      headers,
      targetID,
      app_id,
      limit,
      // __user,
      __a,
      __req,
      __hs,
      dpr,
      __ccg,
      __rev,
      __s,
      __hsi,
      __dyn,
      __csr,
      locale,
      lsd,
      jazoest,
      __sp,
      after_cursor,
      fb_dtsg,
      comments
    }

    return data
  }

  async setup() {
    if (this.#setup_return) return this.#setup_return
    this.#setup_return = await this._setup()

    return this.#setup_return
  }

  async getComments(after_cursor?: string): Promise<AsyncComments> {
    const setup = await this.setup()

    after_cursor ??= setup.comments.meta.afterCursor

    return this.#config
      .fetch(
        `${this.#config.pluginUrl}/comments/async/${setup.targetID}/pager/${
          this.#config.order_by
        }/`,
        {
          headers: setup.headers,
          body: new URLSearchParams({
            app_id: setup.app_id,
            limit: setup.limit,
            __user: setup.comments.meta.userID,
            __a: setup.__a,
            __req: "1",
            __hs: setup.__hs,
            dpr: setup.dpr,
            __ccg: setup.__ccg,
            __rev: setup.__rev,
            __s: setup.__s,
            __hsi: setup.__hsi,
            __dyn: setup.__dyn,
            __csr: setup.__csr,
            locale: setup.locale,
            lsd: setup.lsd,
            jazoest: setup.jazoest,
            __sp: setup.__sp,
            after_cursor
          }),
          method: "POST"
        }
      )
      .then((data) => parseRT(data) as AsyncComments)
  }

  async getMoreComments(
    commentID: string,
    after_cursor?: string
  ): Promise<AsyncComments> {
    const setup = await this.setup()

    const {
      app_id,
      limit,
      __a,
      __req,
      __hs,
      dpr,
      __ccg,
      __rev,
      __s,
      __hsi,
      __dyn,
      __csr,
      locale,
      lsd,
      jazoest,
      __sp
    } = setup

    return this.#config
      .fetch(
        `${this.#config.pluginUrl}/comments/async/comment/${commentID}/pager/`,
        {
          headers: setup.headers,
          body: new URLSearchParams({
            app_id,
            limit,
            __user: setup.comments.meta.userID,
            __a,
            __req,
            __hs,
            dpr,
            __ccg,
            __rev,
            __s,
            __hsi,
            __dyn,
            __csr,
            locale,
            lsd,
            jazoest,
            __sp,
            ...(after_cursor ? { after_cursor } : {})
          }),
          method: "POST"
        }
      )
      .then((data) => parseRT(data) as AsyncComments)
  }

  async postComment(text: string): Promise<PostComment> {
    const setup = await this.setup()

    if (!setup.fb_dtsg) {
      throw new Error("fb_dtsg not found")
    }

    const {
      targetID,
      app_id,
      __a,
      __req,
      __hs,
      dpr,
      __rev,
      __s,
      __hsi,
      __dyn,
      __csr,
      locale,
      lsd,
      jazoest,
      __sp,
      fb_dtsg
    } = setup

    const __user = setup.comments.meta.userID
    const attached_photo_fbid = "0"
    const attached_sticker_fbid = "0"
    const post_to_feed = "false"
    const privacy_option = "everyone"
    const __ccg = "EXCELLENT"

    return this.#config
      .fetch(
        `${
          this.#config.pluginUrl
        }/comments/async/createComment/${targetID}/?av=${__user}`,
        {
          headers: setup.headers,
          method: "POST",
          body: new URLSearchParams({
            app_id,
            text,
            attached_photo_fbid,
            attached_sticker_fbid,
            post_to_feed,
            privacy_option,
            __user,
            __a,
            __req,
            __hs,
            dpr,
            __ccg,
            __rev,
            __s,
            __hsi,
            __dyn,
            __csr,
            locale,
            fb_dtsg,
            jazoest,
            lsd,
            __sp
          })
        }
      )
      .then((data) => parseRT(data) as PostComment)
  }

  async replyComment(commentID: string, text: string): Promise<PostComment> {
    const setup = await this.setup()

    if (!setup.fb_dtsg) {
      throw new Error("fb_dtsg not found")
    }

    const {
      app_id,
      __a,
      __req,
      __hs,
      dpr,
      __rev,
      __s,
      __hsi,
      __dyn,
      __csr,
      locale,
      lsd,
      jazoest,
      __sp,
      fb_dtsg
    } = setup

    const __user = setup.comments.meta.userID
    const attached_photo_fbid = "0"
    const attached_sticker_fbid = "0"
    const post_to_feed = "false"
    const privacy_option = "everyone"
    const __ccg = "EXCELLENT"

    return this.#config
      .fetch(
        `${
          this.#config.pluginUrl
        }/comments/async/createReply/${commentID}/?av=${__user}`,
        {
          headers: setup.headers,
          method: "POST",
          body: new URLSearchParams({
            app_id,
            text,
            attached_photo_fbid,
            attached_sticker_fbid,
            post_to_feed,
            privacy_option,
            __a,
            __req,
            __hs,
            dpr,
            __ccg,
            __rev,
            __s,
            __hsi,
            __dyn,
            __csr,
            locale,
            fb_dtsg,
            jazoest,
            lsd,
            __sp
          })
        }
      )
      .then((data) => parseRT(data) as PostComment)
  }

  async likeComment(commentID: string, isLike: boolean): Promise<PostComment> {
    const setup = await this.setup()

    if (!setup.fb_dtsg) {
      throw new Error("fb_dtsg not found")
    }

    const {
      app_id,
      __a,
      __req,
      __hs,
      dpr,
      __rev,
      __s,
      __hsi,
      __dyn,
      __csr,
      locale,
      lsd,
      jazoest,
      __sp,
      fb_dtsg
    } = setup

    const __user = setup.comments.meta.userID
    const __ccg = "EXCELLENT"

    return this.#config
      .fetch(
        `${
          this.#config.pluginUrl
        }/comments/async/like/?action_like=${isLike}&av=${__user}`,
        {
          headers: setup.headers,
          method: "POST",
          body: new URLSearchParams({
            app_id,
            comment_id: commentID,
            __user,
            __a,
            __req,
            __hs,
            dpr,
            __ccg,
            __rev,
            __s,
            __hsi,
            __dyn,
            __csr,
            locale,
            fb_dtsg,
            jazoest,
            lsd,
            __sp
          })
        }
      )
      .then((data) => parseRT(data) as PostComment)
  }

  async editCommit(commentID: string, text: string): Promise<PostComment> {
    const setup = await this.setup()

    if (!setup.fb_dtsg) {
      throw new Error("fb_dtsg not found")
    }

    const {
      app_id,
      __a,
      __req,
      __hs,
      dpr,
      __rev,
      __s,
      __hsi,
      __dyn,
      __csr,
      locale,
      lsd,
      jazoest,
      __sp,
      fb_dtsg
    } = setup

    const __user = setup.comments.meta.userID
    const attached_photo_fbid = "0"
    const attached_sticker_fbid = "0"
    const post_to_feed = "false"
    const privacy_option = "everyone"
    const __ccg = "EXCELLENT"

    return this.#config
      .fetch(`${this.#config.pluginUrl}/comments/async/edit/?av=${__user}`, {
        headers: setup.headers,
        method: "POST",
        body: new URLSearchParams({
          app_id,
          text,
          comment_id: commentID,
          attached_photo_fbid,
          attached_sticker_fbid,
          post_to_feed,
          privacy_option,
          __user,
          __a,
          __req,
          __hs,
          dpr,
          __ccg,
          __rev,
          __s,
          __hsi,
          __dyn,
          __csr,
          locale,
          fb_dtsg,
          jazoest,
          lsd,
          __sp
        })
      })
      .then((data) => parseRT(data) as PostComment)
  }

  async removeComment(commentID: string): Promise<RemoveComment> {
    const setup = await this.setup()

    if (!setup.fb_dtsg) {
      throw new Error("fb_dtsg not found")
    }

    const {
      app_id,
      __a,
      __req,
      __hs,
      dpr,
      __rev,
      __s,
      __hsi,
      __dyn,
      __csr,
      locale,
      lsd,
      jazoest,
      __sp,
      fb_dtsg
    } = setup

    const __user = setup.comments.meta.userID
    const __ccg = "EXCELLENT"

    return this.#config
      .fetch(`${this.#config.pluginUrl}/comments/async/delete/?av=${__user}`, {
        headers: setup.headers,
        method: "POST",
        body: new URLSearchParams({
          app_id,
          comment_id: commentID,
          __user,
          __a,
          __req,
          __hs,
          dpr,
          __ccg,
          __rev,
          __s,
          __hsi,
          __dyn,
          __csr,
          locale,
          fb_dtsg,
          jazoest,
          lsd,
          __sp
        })
      })
      .then((data) => parseRT(data) as PostComment)
  }
}

export * from "./types/AsyncComments.ts"
export * from "./types/DefaultComments.ts"
export * from "./types/PostComment.ts"
export * from "./types/RemoveComment.ts"
