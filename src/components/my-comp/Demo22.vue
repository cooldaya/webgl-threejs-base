<template>
  <div class="demo21">
    <div class="canvas-wrap" ref="canvasWrapRef"></div>
    <div class="tip">
    </div>
  </div>
</template>

<script setup>
import ThreeTool from "@/utils/tool-v2";
import { onMounted, ref } from "vue";

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
    scene.background = new THREE.Color(0x000000);
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(50, 0.2, 50),
      new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 0 })
    );
    floor.position.y = 0.12;
    scene.add(floor);

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 30,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1, 0.2, 95, 20),
      material
    );
    mesh.position.set(0, 4, 0);
    scene.add(mesh);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.4);
    light1.position.set(0, 10, 0);
    scene.add(light1);

    const light2 = new THREE.SpotLight(0xffffff, 100);
    light2.position.set(0, 8, 2);
    light2.angle = Math.PI / 4;
    light2.penumbra = 0.1;
    scene.add(new THREE.CameraHelper(light2.shadow.camera));
    scene.add(light2);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // 设置阴影投射
    const setupShadow = () => {
      renderer.shadowMap.enabled = true;
      light1.castShadow = true;
      light2.castShadow = true;
      mesh.castShadow = true;
      floor.receiveShadow = true;
    };
    setupShadow();

    // 物体剪切
    const setupClipping = () => {
      const clipPlane = new THREE.Plane(new THREE.Vector3(1, 1, 0), -2); // 设置剪切面的位置和方向
      const helper = new THREE.PlaneHelper(clipPlane, 1, 0xff0000); // 显示剪切面的辅助线
      scene.add(helper);
      // localClippingEnabled 局部剪切
      renderer.localClippingEnabled = true;
      mesh.material.clippingPlanes = [clipPlane]; // 给物体设置剪切面
      mesh.material.clipShadows = true; // 开启阴影剪切

      // globalClippingEnabled 全局剪切
      // renderer.clippingPlanes = [clipPlane]; // 给渲染器设置剪切面
      // renderer.localClippingEnabled = false; // 关闭局部剪切
    };
    setupClipping();

    // threeTool.callOn('renderUpdate',()=>{
    //   mesh.rotation.y += 0.01;
    //   mesh.rotation.x += 0.01;

    // })
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
