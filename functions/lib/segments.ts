import { HandlerEvent } from "@netlify/functions"
const { NODE_ENV } = process.env

export const segment = ({ path }: HandlerEvent): string[] => {
  console.log(NODE_ENV)
  return NODE_ENV === 'development' ? path.replace(/\.netlify\/functions\/[^/]+/, '')
  .split('/').filter(Boolean) : path.replace(/\api\/[^/]+/, '').split('/').filter(Boolean)
}