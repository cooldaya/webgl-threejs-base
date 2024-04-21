<template>
  <div class="demo12">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <!-- <div class="tip">
      在不考虑法相的情况下，使用8个点的立方体
      <br />
      涉及属性 index,position,group
    </div> -->
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
    const bones = [];
    const bone1 = new THREE.Bone();
    const bone2 = new THREE.Bone();
    const bone3 = new THREE.Bone();
    bones.push(bone1, bone2, bone3);
    bone1.add(bone2);
    bone2.add(bone3);

    // 创建Skeleton对象
    const skeleton = new THREE.Skeleton(bones);
    console.log(skeleton);

    // 创建蒙皮网格几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    const position = geometry.attributes.position;
    const skinIndices = [];
    const skinWeights = [];
    for (let i = 0; i < position.count; i++) {
      skinIndices.push(0, 1, 1, 0); // 四个骨骼的索引，每个点受那些骨骼的影响
      skinWeights.push(1, 1, 1, 0); // 四个骨骼的权重，每个点的影响程度
    }

    geometry.setAttribute(
      "skinIndex",
      new THREE.Uint16BufferAttribute(skinIndices, 4)
    );
    geometry.setAttribute(
      "skinWeight",
      new THREE.Float32BufferAttribute(skinWeights, 4)
    );

    const mesh = new THREE.SkinnedMesh(geometry, material);

    mesh.add(bone1); // 将根骨骼添加到网格中
    mesh.bind(skeleton); // 将网格与骨骼进行绑定
    scene.add(mesh);

    // 创建SkeletonHelper对象
    const skeletonHelper = new THREE.SkeletonHelper(mesh);
    scene.add(skeletonHelper);
    skeleton.visible = true;
    console.log(skeletonHelper);

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    threeTool.callOn("renderUpdate", () => {
      // 更新骨骼变换
      bone1.rotation.x += 0.01;
      bone2.rotation.y += 0.02;
      bone3.rotation.z += 0.03;

      // 更新SkeletonHelper
      // skeletonHelper.update();
    });
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo12 {
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
  }
}
</style>
