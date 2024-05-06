<template>
  <div class="demo21">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip">
      1.GLTFLoader 加载模型<br />
      2.DRACOLoader 加载压缩模型<br />
      3.RoomEnvironment 加载环境<br />
      4.AnimationMixer 动画混合<br />
    </div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { onMounted, ref } from "vue";
import { getPdb } from "@/assets/pdbs/getPdb";
import { PDBLoader } from "three/addons/loaders/PDBLoader.js";

const props = defineProps({});
const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({
    cwe: canvasWrap,
    showHelper: 20,
  });

  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    // scene.background = new THREE.Color(0x000000);
    const pot = (...args) => new THREE.Vector(...args);
    const setupAc = () => {
      const closedSpline = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-60, -100, 60),
        new THREE.Vector3(-60, 20, 60),
        new THREE.Vector3(-60, 120, 60),
        new THREE.Vector3(60, 20, -60),
        new THREE.Vector3(60, -100, -60),
      ]);
      closedSpline.curveType = "catmullrom";
      closedSpline.closed = true;

      const extrudeSettings = {
        
      }
    };
    setupAc();
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo21 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .tip {
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
  }
}
</style>
