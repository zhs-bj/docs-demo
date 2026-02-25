import { defineConfig } from 'vitepress'
import { set_sidebar } from "./utils/auto_sidebar.mjs";	// 改成自己的路径



// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/docs-demo/", // 设置部署的基础路径
  head: [["link", { rel: "icon", href: "/docs-demo/logo.png" }]],
  title: "前端学习笔记",
  description: "A VitePress Site",
  themeConfig: {
    sidebar: false, //关闭侧边栏
    aside: "left", // 设置右侧侧边栏显示在左边
    outlineTitle: "目录",
    outline: [2,6],
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text:'首页',link:'/'},

      { text: 'HTML',
        items:[
          {text:'HTML认知',link:'/HTML/HTML认知'},
          {text:'HTML基础',link:'/HTML/HTML基础'}
        ]
      },

      { text: 'CSS',
        items:[
          {text:'CSS基础',link:'/CSS/CSS基础'},
          {text:'CSS进阶',link:'/CSS/CSS进阶'}
        ]
      },

      { text: 'JavaScript',
        items:[
          {text:'JS入门',link:'/JS/JS入门'},
          {text:'JS数据类型',link:'/JS/JS数据类型'}
        ]
      },
      
    ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown 演示', link: '/markdown-examples' },
    //       { text: 'Runtime API 演示', link: '/api-examples' }
    //     ]
    //   }
    // ],

    // sidebar: {
    //   "/front-end/react": set_sidebar("front-end/react"), 
    //   "/backend/rabbitmq": set_sidebar("backend/rabbitmq")
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    footer:{
      copyright:"Copyright @ 2026 pigsy"
    },

       // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  }
})
