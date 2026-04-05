<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { createAsset, fetchAssetDetail, fetchMetadata, updateAsset } from '../api/assets'
import type { ImageAssetPayload, MetadataOptions } from '../types/asset'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const metadata = ref<MetadataOptions>()
const isEdit = computed(() => Boolean(route.params.id))

const form = reactive<ImageAssetPayload>({
  imageName: '',
  imageAlias: '',
  harborProject: '',
  harborRepository: '',
  commonTags: '',
  usageDesc: '',
  teamName: '',
  ownerName: '',
  ownerEmail: '',
  status: 'draft',
  reuseLevel: 'recommended',
  runtimeType: '',
  baseImage: '',
  contentSummary: '',
  startupDesc: '',
  envDesc: '',
  volumeDesc: '',
  portDesc: '',
  confidenceLevel: 'medium',
  lastVerifiedAt: '',
  lastVerifiedBy: '',
  remark: '',
  buildSources: [
    {
      sourceType: 'custom_build_config',
      gitlabProjectUrl: '',
      gitlabProjectName: '',
      branchOrTag: 'main',
      buildFilePath: '',
      buildContextPath: '',
      ciFilePath: '',
      scriptFilePath: '',
      sourceDesc: ''
    }
  ],
  dependencies: []
})

function addSource() {
  form.buildSources.push({
    sourceType: metadata.value?.sourceTypeOptions?.[0] ?? 'dockerfile',
    gitlabProjectUrl: '',
    gitlabProjectName: '',
    branchOrTag: 'main',
    buildFilePath: '',
    buildContextPath: '',
    ciFilePath: '',
    scriptFilePath: '',
    sourceDesc: ''
  })
}

function addDependency() {
  form.dependencies.push({ dependencyName: '', dependencyVersion: '', dependencyType: 'runtime' })
}

async function bootstrap() {
  metadata.value = await fetchMetadata()
  if (!isEdit.value) {
    return
  }
  const detail = await fetchAssetDetail(String(route.params.id))
  Object.assign(form, detail)
}

async function submit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await updateAsset(String(route.params.id), form)
    } else {
      await createAsset(form)
    }
    ElMessage.success('保存成功')
    router.push('/assets')
  } finally {
    loading.value = false
  }
}

onMounted(bootstrap)
</script>

<template>
  <div class="page-shell">
    <div class="page-card">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ isEdit ? '编辑镜像资产' : '新增镜像资产' }}</h1>
          <p class="page-subtitle">第一版以人工录入为主，重点记录镜像去哪改、里面有什么、是否值得复用。</p>
        </div>
        <el-button @click="router.push('/assets')">返回列表</el-button>
      </div>

      <el-form label-width="120px" v-loading="loading">
        <h3 class="section-title">基础信息</h3>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="镜像名称" required><el-input v-model="form.imageName" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="镜像别名"><el-input v-model="form.imageAlias" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Harbor 项目" required><el-input v-model="form.harborProject" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Harbor 仓库" required><el-input v-model="form.harborRepository" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="常用 Tag"><el-input v-model="form.commonTags" placeholder="latest, v1.0.0" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="运行时"><el-select v-model="form.runtimeType" clearable style="width: 100%;"><el-option v-for="item in metadata?.runtimeOptions ?? []" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="维护人" required><el-input v-model="form.ownerName" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="维护邮箱"><el-input v-model="form.ownerEmail" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="所属团队"><el-input v-model="form.teamName" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="状态" required><el-select v-model="form.status" style="width: 100%;"><el-option v-for="item in metadata?.statusOptions ?? []" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="镜像用途" required><el-input v-model="form.usageDesc" type="textarea" :rows="2" /></el-form-item></el-col>
        </el-row>

        <h3 class="section-title">构建来源</h3>
        <el-card v-for="(source, index) in form.buildSources" :key="index" shadow="never" style="margin-bottom: 12px;">
          <el-row :gutter="16">
            <el-col :span="8"><el-form-item label="来源类型" required><el-select v-model="source.sourceType" style="width: 100%;"><el-option v-for="item in metadata?.sourceTypeOptions ?? []" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="GitLab 项目" required><el-input v-model="source.gitlabProjectUrl" /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="项目名称"><el-input v-model="source.gitlabProjectName" /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="分支/Tag"><el-input v-model="source.branchOrTag" /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="构建文件路径" required><el-input v-model="source.buildFilePath" /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="上下文目录"><el-input v-model="source.buildContextPath" /></el-form-item></el-col>
            <el-col :span="12"><el-form-item label="CI 文件路径"><el-input v-model="source.ciFilePath" /></el-form-item></el-col>
            <el-col :span="12"><el-form-item label="脚本路径"><el-input v-model="source.scriptFilePath" /></el-form-item></el-col>
            <el-col :span="24"><el-form-item label="补充说明"><el-input v-model="source.sourceDesc" type="textarea" :rows="2" /></el-form-item></el-col>
          </el-row>
        </el-card>
        <el-button @click="addSource">新增构建来源</el-button>

        <h3 class="section-title" style="margin-top: 24px;">镜像内容摘要</h3>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="基础镜像"><el-input v-model="form.baseImage" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="复用建议"><el-select v-model="form.reuseLevel" style="width: 100%;"><el-option v-for="item in metadata?.reuseLevelOptions ?? []" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="端口"><el-input v-model="form.portDesc" placeholder="8080, 8443" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="可信度"><el-select v-model="form.confidenceLevel" style="width: 100%;"><el-option v-for="item in metadata?.confidenceOptions ?? []" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="内容摘要"><el-input v-model="form.contentSummary" type="textarea" :rows="2" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="启动方式"><el-input v-model="form.startupDesc" type="textarea" :rows="2" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="环境变量"><el-input v-model="form.envDesc" type="textarea" :rows="2" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="挂载说明"><el-input v-model="form.volumeDesc" type="textarea" :rows="2" /></el-form-item></el-col>
        </el-row>

        <h3 class="section-title">关键依赖</h3>
        <el-card v-for="(dependency, index) in form.dependencies" :key="index" shadow="never" style="margin-bottom: 12px;">
          <el-row :gutter="16">
            <el-col :span="8"><el-form-item label="依赖名"><el-input v-model="dependency.dependencyName" /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="版本"><el-input v-model="dependency.dependencyVersion" /></el-form-item></el-col>
            <el-col :span="8"><el-form-item label="类型"><el-select v-model="dependency.dependencyType" style="width: 100%;"><el-option v-for="item in metadata?.dependencyTypeOptions ?? []" :key="item" :label="item" :value="item" /></el-select></el-form-item></el-col>
          </el-row>
        </el-card>
        <el-button @click="addDependency">新增依赖</el-button>

        <h3 class="section-title" style="margin-top: 24px;">确认信息</h3>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="最近确认人"><el-input v-model="form.lastVerifiedBy" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="最近确认时间"><el-date-picker v-model="form.lastVerifiedAt" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="备注"><el-input v-model="form.remark" type="textarea" :rows="3" /></el-form-item></el-col>
        </el-row>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
          <el-button @click="router.push('/assets')">取消</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
