<template>
  <div class="multi-scenes" :id="uuid">
    <div class="canvas-wrap">
      <canvas ref="drawCanvasRef"></canvas>
    </div>
    <div class="diagram-wrap">
      <slot> </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { setupScene, getRenderSceneInfo } from "@/utils/canvas";
import * as THREE from "three";

const props = defineProps({
  // sceneInitFunctionsByName
  sceneInitFunctionsByName: {
    type: Object,
    default: () => ({}),
  },
});
const uuid = "multi-scenes-" + Math.random().toString(36).substr(2, 9);

const drawCanvasRef = ref(null);

const setCanvasRect = () => {
  const canvas = drawCanvasRef.value;
  const parentNode = canvas.parentNode;
  const parentRect = parentNode.getBoundingClientRect();
  canvas.width = parentRect.width;
  canvas.height = parentRect.height;
};
onMounted(() => {
  // 设置画布大小
  setCanvasRect();
  draw();
});

function draw() {
  const canvasList = getVirtualCanvasEls(); // 获取虚拟场景元素
  if (!canvasList.length) return;

  const renderer = new THREE.WebGLRenderer({
    canvas: drawCanvasRef.value,
    alpha: true,
    antialias: true,
  });

  const virtualCanvas = canvasList.map(({ elem: vSceneEl, initFunction }) => {
    const vSceneInfo = setupScene(vSceneEl, initFunction); // 设置虚拟场景
    return {
      // 保存虚拟场景信息
      vSceneInfo,
      vSceneEl,
    };
  });
  function render(time) {
    time *= 0.001;
    renderer.setScissorTest(false);
    renderer.clear(true, true);
    renderer.setScissorTest(true);
    virtualCanvas.forEach((item) => {
      item.vSceneInfo.mesh.rotation.y = time * 0.1;
      const cRect = getRenderSceneInfo(item.vSceneInfo, renderer);
      renderer.setScissor(cRect.x, cRect.y, cRect.width, cRect.height);
      renderer.setViewport(cRect.x, cRect.y, cRect.width, cRect.height);
      item.vSceneInfo.controls.update();
      renderer.render(item.vSceneInfo.scene, item.vSceneInfo.camera);
    });

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function getVirtualCanvasEls(index) {
  const selector_prefix = `#${uuid}>.diagram-wrap `;
  const canvasList = [];
  const sceneInitFunctionsByName = props.sceneInitFunctionsByName;
  for (let selector in sceneInitFunctionsByName) {
    const elem = document.querySelector(selector_prefix + selector);

    if (elem) {
      canvasList.push({
        elem,
        initFunction: sceneInitFunctionsByName[selector],
      });
    }
  }
  return canvasList;
}
</script>

<style lang="less" scoped>
.multi-scenes {
  position: relative;
  width: 100%;
  height: 100%;
  .canvas-wrap {
    // z-index: -1;
    z-index: 99;
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .diagram-wrap {
    position: absolute;
    inset: 0;
    background-color: transparent;
    padding: 1px;
    
  }
}
</style>
