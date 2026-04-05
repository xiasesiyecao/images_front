export interface BuildSourceInput {
  sourceType: string
  gitlabProjectUrl: string
  gitlabProjectName?: string
  branchOrTag?: string
  buildFilePath: string
  buildContextPath?: string
  ciFilePath?: string
  scriptFilePath?: string
  sourceDesc?: string
}

export interface DependencyInput {
  dependencyName: string
  dependencyVersion?: string
  dependencyType?: string
}

export interface ImageAssetPayload {
  id?: number
  imageName: string
  imageAlias?: string
  harborProject: string
  harborRepository: string
  commonTags?: string
  usageDesc: string
  teamName?: string
  ownerName: string
  ownerEmail?: string
  status: string
  reuseLevel?: string
  runtimeType?: string
  baseImage?: string
  contentSummary?: string
  startupDesc?: string
  envDesc?: string
  volumeDesc?: string
  portDesc?: string
  confidenceLevel?: string
  lastVerifiedAt?: string
  lastVerifiedBy?: string
  remark?: string
  buildSources: BuildSourceInput[]
  dependencies: DependencyInput[]
}

export interface ImageAsset extends Omit<ImageAssetPayload, 'buildSources' | 'dependencies'> {
  id: number
  assetCode: string
  buildSources: BuildSourceInput[]
  dependencies: DependencyInput[]
}

export interface MetadataOptions {
  statusOptions: string[]
  reuseLevelOptions: string[]
  confidenceOptions: string[]
  runtimeOptions: string[]
  sourceTypeOptions: string[]
  dependencyTypeOptions: string[]
}
