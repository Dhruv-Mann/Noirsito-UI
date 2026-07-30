import { registryData } from '~~/server/utils/registryData'

export default defineEventHandler((event) => {
  let name = getRouterParam(event, 'name') || ''
  
  // Clean off .json suffix if CLI requests glowing-button.json
  if (name.endsWith('.json')) {
    name = name.slice(0, -5)
  }

  const component = registryData[name]

  if (!component) {
    throw createError({
      statusCode: 404,
      statusMessage: `Component "${name}" was not found in the Noirsito-UI registry.`
    })
  }

  return component
})
