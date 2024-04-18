<template>
  <div class="demo1">
    <div class="wrap">
      <MultiScenes :sceneInitFunctionsByName="sceneInitFunctionsByName">
        <div class="virtual_canvas"></div>

        <p>
          This is a demo of MultiScenes component. You can add multiple scenes
          to the same canvas by using the MultiScenes component.
        </p>
        <div class="virtual_canvas" id="ffdd"></div>

        小心西
        <div class="virtual_canvas" id="xxxddd"></div>
        <div class="virtual_canvas" id="ddxxf"></div>

      </MultiScenes>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({});

// 对不同元素渲染不同的场景
const sceneInitFunctionsByName = {
  ".virtual_canvas": (THREE) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "red" });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  },
  "#ffdd": (THREE, sceneInfo) => {
    const geometry = new THREE.DodecahedronGeometry(1);
    const material = new THREE.MeshPhongMaterial({ color: "blue" });
    const mesh = new THREE.Mesh(geometry, material);
    sceneInfo.camera.position.set(0, 3, 4);
    return mesh;
  },
  "#xxxddd": (THREE, sceneInfo) => {
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "lightblue" });
    const mesh = new THREE.Mesh(geometry, material);
    sceneInfo.camera.position.set(0, 2, 2);
    return mesh;
  },
  "#ddxxf": (THREE, sceneInfo) => {
    const size = 4;
    const widthSegments = 1;
    const heightSegments = 1;
    const depthSegments = 1;
    const geometry = new THREE.WireframeGeometry(
      new THREE.BoxGeometry(
        size,
        size,
        size,
        widthSegments,
        heightSegments,
        depthSegments
      )
    );
    const material = new THREE.MeshPhongMaterial({ color: "lightblue" });
    const mesh = new THREE.Mesh(geometry, material);
    sceneInfo.camera.position.set(0, 10, 10);
    return mesh;
  },
};
</script>

<style lang="less" scoped>
.demo1 {
  .wrap {
    width: 1200px;
    height: 600px;
    .virtual_canvas {
      display: inline-block;
      width: 160px;
      height: 160px;
      border: dashed 1px #ccc;
      margin: 10px;
      background-color: white;
    }
  }
}
</style>
