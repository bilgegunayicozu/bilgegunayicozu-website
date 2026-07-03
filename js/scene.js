/* Ambient WebGL hero background — laser-line field, red on black. */
(function () {
  'use strict';

  var canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  if (typeof window.THREE === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var THREE = window.THREE;
  var hero = canvas.closest('.hero');

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setSize(hero.clientWidth, hero.clientHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, hero.clientWidth / hero.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  var group = new THREE.Group();
  scene.add(group);

  var RAY_COUNT = window.innerWidth < 760 ? 22 : 42;
  var rays = [];
  var redA = new THREE.Color('#ff3b26');
  var redB = new THREE.Color('#ff8a6a');

  for (var i = 0; i < RAY_COUNT; i++) {
    var points = [];
    var segs = 2;
    for (var s = 0; s <= segs; s++) {
      points.push(new THREE.Vector3((s / segs) * 14 - 7, 0, 0));
    }
    var geo = new THREE.BufferGeometry().setFromPoints(points);
    var color = redA.clone().lerp(redB, Math.random());
    var mat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.06 + Math.random() * 0.16
    });
    var line = new THREE.Line(geo, mat);
    line.position.y = (Math.random() - 0.5) * 8;
    line.position.z = (Math.random() - 0.5) * 6;
    line.rotation.z = (Math.random() - 0.5) * 0.5;
    line.userData = {
      baseY: line.position.y,
      speed: 0.15 + Math.random() * 0.35,
      offset: Math.random() * Math.PI * 2,
      amp: 0.4 + Math.random() * 1.1
    };
    group.add(line);
    rays.push(line);
  }

  /* soft particle dust */
  var dustCount = window.innerWidth < 760 ? 80 : 180;
  var dustGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(dustCount * 3);
  for (var d = 0; d < dustCount; d++) {
    positions[d * 3] = (Math.random() - 0.5) * 16;
    positions[d * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[d * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  var dustMat = new THREE.PointsMaterial({ color: 0xf4f1e9, size: 0.02, transparent: true, opacity: 0.35 });
  var dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  var mouseX = 0, mouseY = 0, targetRotX = 0, targetRotY = 0;
  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  var visible = true;
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    io.observe(hero);
  }

  function resize() {
    var w = hero.clientWidth, h = hero.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(hero);
  }
  resize();

  var clock = new THREE.Clock();

  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    var t = clock.getElapsedTime();

    rays.forEach(function (line) {
      var u = line.userData;
      line.position.y = u.baseY + Math.sin(t * u.speed + u.offset) * u.amp * 0.3;
      line.material.opacity = 0.06 + (Math.sin(t * u.speed * 1.4 + u.offset) * 0.5 + 0.5) * 0.16;
    });

    dust.rotation.y = t * 0.02;

    targetRotY = mouseX * 0.12;
    targetRotX = mouseY * 0.06;
    group.rotation.y += (targetRotY - group.rotation.y) * 0.03;
    group.rotation.x += (-targetRotX - group.rotation.x) * 0.03;
    camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  tick();
})();
