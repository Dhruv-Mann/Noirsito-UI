import { registryMetadata, getRegistryItem } from '~~/server/utils/registryData'

export default defineEventHandler(async () => {
  const items = await Promise.all(
    Object.keys(registryMetadata).map(name => getRegistryItem(name))
  )
  return items.filter(Boolean).map(item => ({
    name: item!.name,
    title: item!.title,
    category: item!.category,
    description: item!.description,
    dependencies: item!.dependencies || [],
    filesCount: item!.files.length
  }))
})
