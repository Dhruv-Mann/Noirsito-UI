import { getRegistryItem } from '~~/server/utils/registryData'

export default defineEventHandler(async (event) => {
  let name = getRouterParam(event, 'name') || ''
  
  if (name.endsWith('.json')) {
    name = name.slice(0, -5)
  }

  const component = await getRegistryItem(name)

  if (!component) {
    throw createError({
      statusCode: 404,
      statusMessage: `Component "${name}" was not found in the Noirsito-UI registry.`
    })
  }

  return component
})
