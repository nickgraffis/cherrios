import { get } from "./get"
import { put } from "./put"
import { safeAwait } from "./safeawait"

export const updateGroupCount = async (groupId: string, userId: string, pm: boolean) => {
  const [groupError, groupResponse] = await safeAwait(
    get({
      base: 'Groups',
      id: groupId,
      user: userId
    }) 
  )

  if (groupError || !groupResponse?.body) return {
    statusCode: 500,
    body: JSON.stringify({ groupError })
  }

  const oldCount = JSON.parse(groupResponse.body).record.fields.contactCount

  if (isNaN(oldCount)) return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Not sure why, but the old group count wasn\'t a number.' })
  }

  const [updateGroupError] = await safeAwait(
    put({
      base: 'Groups',
      fields: {
        contactCount: pm ? oldCount + 1 : oldCount - 1
      },
      user: userId,
      id: groupId
    })
  )

  if (updateGroupError) return {
    statusCode: 500,
    body: JSON.stringify({ updateGroupError })
  }

  return true
}