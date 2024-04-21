<template>
  <div class="demo10">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="controls">
      <button id="playBtn">播放</button>
    </div>
    <div class="tip">
      在不考虑法相的情况下，使用8个点的立方体
      <br />
      涉及属性 morphAttributes,morphTargetInfluences
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
    showHelper: 500,
    showGUI: true,
  });
  threeTool.utils.addMesh(({ scene, renderer, camera }, THREE) => {
    camera.position.set(80, 80, 80);
    const geometry = new THREE.BoxGeometry(50, 50, 50);

    const target1 = new THREE.BoxGeometry(50, 200, 50).getAttribute("position"); // 变高
    const target2 = new THREE.BoxGeometry(10, 50, 10).getAttribute("position"); // 变细
    // 设置集合体顶点变形目标数据，可以设置1组或多组
    geometry.morphAttributes.position = [target1, target2];


    // morphAttributes 属性类型 { position: Array<THREE.BufferAttribute> , normal: Array<THREE.BufferAttribute> , uv: Array<THREE.BufferAttribute> }
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    cube.morphTargetInfluences[0] = 0; // 设置初始变形强度
    cube.morphTargetInfluences[1] = 0; // 设置初始变形强度

    // GUI 控制
    threeTool._gui
      .add(cube.morphTargetInfluences, "0", 0, 1, 0.01)
      .name("go to target1"); // 添加变形强度滑块

    threeTool._gui
      .add(cube.morphTargetInfluences, "1", 0, 1, 0.01)
      .name("go to target2"); // 添加变形强度滑块

    cube.name = "cube";

    // 创建帧动画
    const kf1 = new THREE.KeyframeTrack(
      "cube.morphTargetInfluences[0]",
      [0, 5],
      [0, 1]
    );
    const kf2 = new THREE.KeyframeTrack(
      "cube.morphTargetInfluences[1]",
      [5, 10],
      [1, 0]
    );
    const clip = new THREE.AnimationClip("clip", 10, [kf1, kf2]);

    threeTool.utils.playModelAnimation(cube, clip, (clipAc) => {
      clipAc.loop = THREE.LoopOnce;
      // 物体状态停留在动画结束的时候
      clipAc.clampWhenFinished = true;
    });
    console.log(threeTool._gui)
    threeTool.callOn('renderUpdate',()=>{
      threeTool._gui.controllers.forEach(con=>con.updateDisplay())
    })
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo10 {
  position: relative;
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
  .controls {
    position: absolute;
    left: 10px;
    bottom: 10px;
    button {
      background-color: aquamarine;

      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      color: white;

      font-size: 16px;
    }
  }
  .tip {
    position: absolute;
    right: -10px;
    bottom: 10px;
    background: white;
    transform: translateX(100%);
  }
}
</style>
