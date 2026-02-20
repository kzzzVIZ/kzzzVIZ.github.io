document.addEventListener('DOMContentLoaded', () => {
  const modelVideo = document.querySelector('.modelVideo');
  if (modelVideo) {
    let startX = 0
    let lastMovement = 0
    let inertiaTimeout = null

    function scrubVideo(byAmount) {
      if (!isNaN(byAmount)) {
        if (modelVideo.currentTime - byAmount <= 0) {
          modelVideo.currentTime = modelVideo.duration - byAmount;
        } else if (modelVideo.currentTime - byAmount > modelVideo.duration) {
          modelVideo.currentTime = byAmount;
        } else {
          modelVideo.currentTime = modelVideo.currentTime - byAmount;
        }
      }
    }

    function doInertia(inertia, inertiaDirection) {
      inertiaTimeout = setTimeout(() => {
        if (inertia < 0.01) return
        scrubVideo(inertia * inertiaDirection)
        inertia *= 0.9;
        doInertia(inertia, inertiaDirection);
      }, 10)
    }

    function scrubHandler(e) {
      const x = (e.clientX - startX) * 0.02;
      startX = e.clientX;
      scrubVideo(x)
      lastMovement = x
    }

    modelVideo.addEventListener('mousedown', (e) => {
      if (inertiaTimeout) clearTimeout(inertiaTimeout)
      startX = e.clientX;
      document.addEventListener('mousemove', scrubHandler);
      // delete this if you want it to keep going after rotating
      //modelVideo.pause()
    })

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', scrubHandler);
      let inertia = Math.abs(lastMovement * 2);
      let inertiaDirection = lastMovement > 0 ? 1 : -1;
      doInertia(inertia, inertiaDirection);
      lastMovement = 0
    })

    document.addEventListener('mouseleave', () => {
      document.removeEventListener('mousemove', scrubHandler);
    })
  }
});
