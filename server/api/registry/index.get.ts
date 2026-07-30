import { registryData } from '~~/server/utils/registryData'

export default defineEventHandler(() => {
  return Object.values(registryData).map(item => ({
    name: item.name,
    title: item.title,
    category: item.category,
    description: item.description,
    dependencies: item.dependencies || [],
    filesCount: item.files.length
  }))
})
