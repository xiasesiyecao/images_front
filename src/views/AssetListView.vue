<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAssets, fetchMetadata } from '../api/assets'
import type { ImageAsset, MetadataOptions } from '../types/asset'

const router = useRouter()
const loading = ref(false)
const total = ref(0)
const records = ref<ImageAsset[]>([])
const metadata = ref<MetadataOptions>()
const query = reactive({
  current: 1,
  size: 10,
  keyword: '',
  harborProject: '',
  status: '',
  ownerName: '',
  runtimeType: ''
})

async function load() {
  loading.value = true
  try {
    const [page, options] = await Promise.all([
      fetchAssets(query),
      metadata.value ? Promise.resolve(metadata.value) : fetchMetadata()
    ])
    records.value = page.records
    total.value = page.total
    metadata.value = options
  } finally {
    loading.value = false
  }
}

function reset() {
  query.keyword = ''
  query.harborProject = ''
  query.status = ''
  query.ownerName = ''
  query.runtimeType = ''
  query.current = 1
  load()
}

onMounted(load)
</script>

<template>
  <div class="page-shell">
    <div class="page-card">
      <div class="page-header">
        <div>
          <h1 class="page-title">镜像资产台账</h1>
          <p class="page-subtitle">先把 Harbor 镜像和 GitLab 构建来源对齐，再逐步增加自动扫描和派生构建能力。</p>
        </div>
        <el-button type="primary" @click="router.push('/assets/new')">新增镜像资产</el-button>
      </div>

      <el-form :inline="true" :model="query" style="margin-bottom: 18px;">
        <el-form-item label="关键字">
          <el-input v-model="query.keyword" placeholder="镜像名 / 仓库 / 用途" clearable />
        </el-form-item>
        <el-form-item label="Harbor 项目">
          <el-input v-model="query.harborProject" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" clearable style="width: 160px;">
            <el-option v-for="item in metadata?.statusOptions ?? []" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="运行时">
          <el-select v-model="query.runtimeType" clearable style="width: 160px;">
            <el-option v-for="item in metadata?.runtimeOptions ?? []" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="维护人">
          <el-input v-model="query.ownerName" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="load">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="records" border v-loading="loading">
        <el-table-column prop="imageName" label="镜像名称" min-width="180" />
        <el-table-column prop="harborProject" label="Harbor 项目" width="150" />
        <el-table-column prop="harborRepository" label="仓库名" min-width="180" />
        <el-table-column prop="runtimeType" label="运行时" width="110" />
        <el-table-column prop="ownerName" label="维护人" width="120" />
        <el-table-column prop="status" label="状态" width="140">
          <template #default="{ row }">
            <el-tag :type="row.status === 'confirmed' ? 'success' : row.status === 'deprecated' ? 'info' : 'warning'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contentSummary" label="内容摘要" min-width="240" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-space>
              <el-button link type="primary" @click="router.push(`/assets/${row.id}`)">详情</el-button>
              <el-button link @click="router.push(`/assets/${row.id}/edit`)">编辑</el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <el-pagination
          v-model:current-page="query.current"
          v-model:page-size="query.size"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="load"
        />
      </div>
    </div>
  </div>
</template>
