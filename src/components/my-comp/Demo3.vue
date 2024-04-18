<template>
  <div class="demo3">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { setupCanvas } from "@/utils/canvas";
import { onMounted, ref } from "vue";

const props = defineProps({});

const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({ cwe: canvasWrap });
  threeTool.utils.addMesh(({ scene, renderer }, THREE) => {
    // 添加meshes
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const defaultColor = new THREE.Color("rgb(255, 255, 255)");
    const mesheInfos = [
      {
        position: [-1, 0.5, 0],
      },
      {
        position: [1, 0.5, 0],
      },
      {
        position: [3, 0.5, 2],
      },
    ];
    const meshes = new THREE.InstancedMesh(
      geometry,
      material,
      mesheInfos.length
    );

    mesheInfos.forEach((info, index) => {
      meshes.setMatrixAt(
        index,
        new THREE.Matrix4().makeTranslation(...info.position)
      );
      meshes.setColorAt(index, defaultColor);
    });

    scene.add(meshes);

    // 添加光源
    const directLight = new THREE.DirectionalLight(0xffffff, 1);
    directLight.position.set(2, 4, 4);
    scene.add(directLight);

    // 添加点击事件
    const clickHandler = (eventObj) => {
      const {curObj,preObj,intersects} = eventObj;

      if(curObj){
        const instanceId = curObj.instanceId;
        const instancedMesh = curObj.object;
        instancedMesh.setColorAt(instanceId, new THREE.Color("rgb(255, 0, 0)"))
        if(preObj) instancedMesh.setColorAt(preObj.instanceId, defaultColor)
        instancedMesh.instanceColor.needsUpdate = true;
      }
    }
    // threeTool.addPickEventListener([meshes], clickHandler);

    threeTool.eventOn('hover',clickHandler,[meshes])
  });
};

onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo3 {
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
