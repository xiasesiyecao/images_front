<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAssetDetail } from '../api/assets'
import type { ImageAsset } from '../types/asset'

const route = useRoute()
const router = useRouter()
const detail = ref<ImageAsset>()

onMounted(async () => {
  detail.value = await fetchAssetDetail(String(route.params.id))
})
</script>

<template>
  <div class="page-shell">
    <div class="page-card" v-if="detail">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ detail.imageName }}</h1>
          <p class="page-subtitle">{{ detail.harborProject }}/{{ detail.harborRepository }} · {{ detail.assetCode }}</p>
        </div>
        <el-space>
          <el-button @click="router.push('/assets')">返回列表</el-button>
          <el-button type="primary" @click="router.push(`/assets/${detail.id}/edit`)">编辑</el-button>
        </el-space>
      </div>

      <h3 class="section-title">基础信息</h3>
      <div class="detail-grid">
        <div class="detail-item"><div class="detail-label">镜像用途</div><div class="detail-value">{{ detail.usageDesc || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">维护人</div><div class="detail-value">{{ detail.ownerName || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">状态</div><div class="detail-value">{{ detail.status || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">运行时</div><div class="detail-value">{{ detail.runtimeType || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">基础镜像</div><div class="detail-value">{{ detail.baseImage || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">常用 Tag</div><div class="detail-value">{{ detail.commonTags || '-' }}</div></div>
      </div>

      <h3 class="section-title" style="margin-top: 24px;">构建来源</h3>
      <el-table :data="detail.buildSources ?? []" border>
        <el-table-column prop="sourceType" label="来源类型" width="180" />
        <el-table-column prop="gitlabProjectName" label="项目名" width="180" />
        <el-table-column prop="gitlabProjectUrl" label="GitLab 项目" min-width="260" show-overflow-tooltip />
        <el-table-column prop="branchOrTag" label="分支/Tag" width="140" />
        <el-table-column prop="buildFilePath" label="构建文件路径" min-width="240" show-overflow-tooltip />
        <el-table-column prop="buildContextPath" label="上下文目录" min-width="200" show-overflow-tooltip />
      </el-table>

      <h3 class="section-title" style="margin-top: 24px;">镜像内容</h3>
      <div class="detail-grid">
        <div class="detail-item"><div class="detail-label">内容摘要</div><div class="detail-value">{{ detail.contentSummary || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">启动方式</div><div class="detail-value">{{ detail.startupDesc || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">环境变量</div><div class="detail-value">{{ detail.envDesc || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">挂载说明</div><div class="detail-value">{{ detail.volumeDesc || '-' }}</div></div>
      </div>

      <h3 class="section-title" style="margin-top: 24px;">关键依赖</h3>
      <el-table :data="detail.dependencies ?? []" border>
        <el-table-column prop="dependencyName" label="依赖名" min-width="180" />
        <el-table-column prop="dependencyVersion" label="版本" width="140" />
        <el-table-column prop="dependencyType" label="类型" width="180" />
      </el-table>

      <h3 class="section-title" style="margin-top: 24px;">确认信息</h3>
      <div class="detail-grid">
        <div class="detail-item"><div class="detail-label">最近确认人</div><div class="detail-value">{{ detail.lastVerifiedBy || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">最近确认时间</div><div class="detail-value">{{ detail.lastVerifiedAt || '-' }}</div></div>
        <div class="detail-item"><div class="detail-label">备注</div><div class="detail-value">{{ detail.remark || '-' }}</div></div>
      </div>
    </div>
  </div>
</template>
