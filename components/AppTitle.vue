<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <h1>This is {{ route.name?.toString().toLocaleUpperCase() }} page</h1>
</template>
