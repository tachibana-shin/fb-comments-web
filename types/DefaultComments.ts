export interface User {
  type: "user"
  id: string
  name: string
  thumbSrc: string
  uri: string
  isVerified: boolean
}
export interface OGObject {
  id: string
  name: string
  uri: string
  type: "ogobject"
}
export interface Comment {
  id: string
  authorID: string
  body: {
    text: string
  }
  ranges: never[]
  timestamp: {
    time: number
    text: string
  }
  targetID: string
  ogURL: string
  likeCount: number
  hasLiked: boolean
  canLike: boolean
  canEdit: boolean
  hidden: boolean
  highlightedWords: string[]
  reportURI: string
  spamCount: number
  canEmbed: boolean
  type: "comment"
  public_replies?: { totalCount: number; commentIDs: string[]; afterCursor?: string }
}

export interface DefaultComments {
  comments: {
    commentIDs: string[]
    idMap: Record<string, User | OGObject | Comment>
  }
  meta: {
    targetFBID: string
    href: string
    userID: string
    actorsOptIn: Record<string, boolean>
    actors: Record<string, User>
    totalCount: number
    afterCursor: string
    appID: string
    isMobile: boolean
    isModerator: boolean
    minFeedLength: number
    maxCommentLength: number
    enablePhoto: boolean
    enableSticker: boolean
    threadClosed: boolean
    shouldSwitchAccount: boolean
    fromModTool: boolean
    privacyOptionsList: never[]
    composerSearchSource: {
      __m: string
    }
    channelURL: string
    consentRequired: boolean
  }
  initialOrdering: string
  rankingAllowed: boolean
}
