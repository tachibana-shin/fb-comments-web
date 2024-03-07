import { User, OGObject, Comment } from "./DefaultComments.ts"

export interface PostComment {
  lid: string
  payload: {
    commentID: string
    idMap: Record<string, User | OGObject | Comment>
  }
  __ar: number
}
