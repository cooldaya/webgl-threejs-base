<template>
  <div class="demo2">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool";
import { setupCanvas } from "@/utils/canvas";
import { onMounted, ref } from "vue";

const props = defineProps({});

const canvasWrapRef = ref(null);
const draw = () => {
  const canvasWrap = canvasWrapRef.value;
  const threeTool = new ThreeTool({cwe: canvasWrap});
  threeTool.utils.addMesh(({scene},THREE)=>{
    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    const material = new THREE.MeshPhongMaterial( { color: 'rgb(112, 80, 134)' } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.y = 1;
    scene.add( cube );
    const directLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directLight.position.set( 0, 4, 4 );
    scene.add( directLight );
  })
};



onMounted(() => {
  draw();
});
</script>

<style lang="less" scoped>
.demo2 {
  .canvas-wrap {
    width: 1200px;
    height: 600px;
  }
}
</style>
