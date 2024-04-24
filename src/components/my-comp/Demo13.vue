<template>
  <div class="demo13">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip">
      保持60fps
      <br />
      基础 <span class="text-red">350万粒子</span> BufferGeometry
      <hr />
      设置<span class="text-red">index</span>属性，<span class="text-red">650万粒子</span>
      <br />
      <p class="des">
        对于粒子系统这种没有共享顶点的几何体,设置索引主要是为了获得更好的缓存局部性和更有利于GPU的内存访问模式,从而提高渲染性能。
        没有设置索引时,GPU在渲染的时候需要按顺序从顶点数据缓存中取出顶点数据。由于粒子通常随机分布,相邻粒子之间的顶点在内存中可能相距很远,导致CPU和GPU之间大量数据传输,降低了局部性。
        而设置索引后,顶点数据被重新排列并紧密存储,相邻粒子的顶点数据离彼此更近了。GPU在渲染时可以通过索引数组按序快速访问这些连续排列的顶点数据,减少了CPU和GPU之间的数据传输,提高了缓存命中率。
        另一方面,索引还为GPU提供了一些额外的优化机会。例如,在渲染过程中,GPU可能会提前加载和缓存将要访问的顶点数据,正是因为有了索引数据,GPU
        可以更好地预测未来需要访问哪些顶点,从而更好地利用缓存并减少内存带宽压力。
        因此,尽管粒子系统中没有共享顶点的问题,但索引使顶点之间有了一个更有序的存储结构,更有利于GPU高效地访问和缓存这些数据,从而提高了整体的渲染性能。
        这也是为什么在大多数情况下,即使对于没有共享顶点的几何体,使用索引来渲染也被认为是一种优化的最佳实践。当然,具体的性能提升程度还取决于渲染状态、GPU硬件等多方面因素
      </p>
    </div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { effect, onMounted, ref } from "vue";

import * as THREE from "three";
import getTextureImg from "@/assets/textures/cube6p/getImg.js";
import getModelUrl from "@/assets/models/getModelUrl.js";

const props = defineProps({});

const loading = ref(false);
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    const count = 6500000;
    for (let i = 0; i < count; i++) {
      const x = 2000 * Math.random() - 1000;
      const y = 2000 * Math.random() - 1000;
      const z = 2000 * Math.random() - 1000;

      vertices.push(x, y, z);
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    const indices = new Uint16Array(vertices.length / 3);
    for (let i = 0; i < indices.length; i++) {
      indices[i] = i;
    }
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    const sprite = new THREE.TextureLoader().load(
      "/assets/textures/fire_02.png"
    );
    sprite.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.PointsMaterial({
      size: 10,
      sizeAttenuation: true,
      alphaTest: 0.5,
      transparent: true,
      map: sprite,
    });

    const particles = new THREE.Points(geometry, material);
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    scene.add(particles);
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo13 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .tip {
    position: absolute;
    right: -10px;
    bottom: 10px;
    background: white;
    transform: translateX(100%);
    max-width: 300px;
  }
  .text-red {
    color: red;
  }

  .des {
    height: 200px;
    max-width: 300px;
    overflow: scroll;
  }
}
</style>
