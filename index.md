---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "前端学习笔记"
  text: " HTML / CSS / JavaScript / VitePress"
  tagline: 持续学习，持续进步
  image:
    src: /background.png
    alt: 前端学习
  actions:
    - theme: brand
      text: 京东网站
      link: https://www.jd.com
    - theme: alt
      text: API 示例
      link: /api-examples

features:
  - title: HTML 学习
    details: 从基础标签到综合案例，构建网页骨架。
    icon: 📝
  - title: CSS 学习
    details: 掌握选择器、样式和布局，美化页面。
    icon: 🎨
  - title: JavaScript 学习
    details: 学习变量、函数和交互，让网页动起来。
    icon: ⚡
  - title: VitePress 搭建
    details: 从环境配置到 GitHub Pages 部署，打造自己的文档网站。
    icon: 🚀
---

<script setup>
// 页面加载后弹出欢迎语
import { onMounted } from 'vue'
onMounted(() => {
  console.log('欢迎来到我的前端学习笔记！')
})
</script>
