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
import { ref } from "vue";

const currentComp = ref("Demo31");
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
    label: "InstancedBufferGeometry 优化",
    comp: "Demo14",
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
    label: "粒子 points",
    comp: "Demo13",
  },
  {
    label: "fog 雾",
    comp: "Demo15",
  },
  {
    label: "天空球",
    comp: "Demo16",
  },
  {
    label: "水面",
    comp: "Demo17",
    label: "ammo-physics 物理引擎",
    comp: "Demo20",
  },
  {
    label: "加载环境",
    comp: "Demo21",
  },
  {
    label: "clipping 物体裁剪",
    comp: "Demo22",
  },
  {
    label: "pdb 加载",
    comp: "Demo23",
  },
  {
    label: "模型 animations morph",
    comp: "Demo26",
  },
  {
    label: "天空盒 图片裁切",
    comp: "Demo27",
  },
  {
    label: "water sky",
    comp: "Demo28",
  },
  {
    label: "shader 着色器",
    comp: "Demo29",
  },
  {
    label: "outlinePass",
    comp: "Demo30",
  },
  {
    label: "ammojs 物理引擎",
    comp: "Demo31",
  },
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
  width: 80%;

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
