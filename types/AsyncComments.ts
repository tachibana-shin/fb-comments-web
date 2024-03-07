import { User, OGObject, Comment } from "./DefaultComments.ts"

export interface AsyncComments {
  __ar: number
  payload: {
    totalCount: number
    commentIDs: string[]
    afterCursor: string
    idMap: Record<string, User | OGObject | Comment>
  }
  hsrp: {
    hblp: {
      consistency: {
        rev: number
      }
      rsrcMap: Record<
        string,
        {
          type: string
          src: string
          nc: number
        }
      >
    }
  }
  allResources: string[]
  lid: string
}
