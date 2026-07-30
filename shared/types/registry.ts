export type ComponentCategory = 
  | 'buttons' 
  | 'cards' 
  | 'inputs' 
  | 'modals' 
  | 'badges' 
  | 'tabs' 
  | 'animations'

export interface RegistryFile {
  path: string
  content: string
  type: 'registry:ui' | 'registry:component' | 'registry:lib'
  targetPath?: string
}

export interface RegistryItem {
  name: string
  title: string
  category: ComponentCategory
  description: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
  props?: Array<{
    name: string
    type: string
    default?: string
    description: string
  }>
}

export interface RegistryMeta {
  name: string
  title: string
  category: ComponentCategory
  description: string
  tags: string[]
  isNew?: boolean
}
