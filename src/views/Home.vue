<template>
  <div class="home">
    <h1 class="title">Welcome to KT Study</h1>

    <ul class="demo-list">
      <li
        v-for="demo in demos"
        :key="demo.label"
        @click="currentComp = demo.comp"
        :class="{ active: currentComp === demo.comp }"
      >
        {{ demo.label }}
      </li>
    </ul>

    <div class="demo-wrap">
      <Component :is="currentComp" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const currentComp = ref("Demo13");
const demos = [
  {
    label: "多场景渲染",
    comp: "Demo1",
  },
  {
    label: "基础三维场景的构成",
    comp: "Demo2",
  },
  {
    label: "bufferGeometry 多色立方体",
    comp: "Demo11",
  },
  {
    label: "鼠标事件交互",
    comp: "Demo3",
  },
  {
    label: "光照/阴影",
    comp: "Demo4",
  },
  {
    label: "材质",
    comp: "Demo5",
  },
  {
    label: "纹理",
    comp: "Demo6",
  },
  {
    label: "信息框/标记",
    comp: "Demo7",
  },
  {
    label: "Loader 加载模型",
    comp: "Demo8",
  },
  {
    label: "关键帧动画-颜色与位置",
    comp: "Demo9",
  },
  {
    label: "关键帧动画-形状",
    comp: "Demo10",
  },
  {
    label: "骨骼动画",
    comp: "Demo12",
  },
  {
    label:'粒子 points',
    comp: 'Demo13'
  }
];
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.title {
  margin-top: 100px;
  color: white;
  font-size: 40px;
}
.demo-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  li {
    padding: 4px 10px;
    border: solid 1px white;
    border-radius: 8px;
    color: white;
    &:hover {
      cursor: pointer;
      background-color: white;
      color: #418f9c;
    }
    &.active {
      background-color: white;
      color: #418f9c;
      border-color: white;
    }
  }
}
.demo-wrap {
  margin-top: 40px;
  outline: dashed 1px #ccc;
  width: 1200px;
  height: 600px;
}
</style>
