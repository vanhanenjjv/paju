<!-- 
      NOTE: Initially I wanted to separate the video and canvas into separate components,
            but it became difficult to pass the needed data between them. I tried using
            ImageCapture and OffscreenCanvas, but those weren't implemented in Safari.
-->

<script lang="ts">
  import { onMount } from "svelte";
  import Hidable from "$lib/components/hidable.svelte";

  type View = "video" | "canvas" | "none";

  type Video = { element: HTMLVideoElement | null; stream: MediaStream | null };

  type Canvas = {
    element: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
  };

  const video: Video = {
    element: null,
    stream: null,
  };

  const canvas: Canvas = {
    element: null,
    context: null,
  };

  $: view =
    // NOTE: Just to be sure that the video and canvas don't render at the same time.
    (video.stream && canvas.context
      ? "none"
      : video.stream
      ? "video"
      : canvas.context
      ? "canvas"
      : // NOTE: For some reason the 'satisfies' keyword does not type the string properly.
        "none") satisfies View as View;

  async function hasCamera() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === "videoinput");
  }

  async function showVideo() {
    try {
      if (video.element === null) throw new Error("Video element is null.");

      canvas.context = null;

      video.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1080 },
          height: { ideal: 1920 },
        },
        audio: false,
      });

      video.element.srcObject = video.stream;
    } catch (error) {
      alert(error);
    }
  }

  async function showCanvas() {
    try {
      if (video.element === null) throw new Error("Video element is null.");
      if (video.stream === null) throw new Error("Video stream is null.");
      if (canvas.element === null) throw new Error("Canvas element is null.");

      canvas.context = canvas.element.getContext("2d");

      if (canvas.context === null) throw new Error("Canvas context is null.");

      canvas.context.drawImage(
        video.element,
        video.element.width,
        video.element.height
      );
      video.stream = null;
    } catch (error) {
      alert(error);
    }
  }

  onMount(async () => {
    if (!(await hasCamera())) {
      console.log("No camera detected.");
    } else {
      await showVideo();
    }
  });
</script>

<Hidable hidden={view !== "video"}>
  <div id="video" class="stack">
    <video bind:this={video.element} class="screen" autoplay playsinline>
      <!-- TODO: Figure out wtf this is. -->
      <track kind="captions" />
    </video>
    <div class="user-interface">
      <button class="show-canvas" on:click={() => showCanvas()}></button>
    </div>
  </div>
</Hidable>

<Hidable hidden={view !== "canvas"}>
  <div id="video" class="stack">
    <canvas
      bind:this={canvas.element}
      class="screen"
      width="1080"
      height="1920"
    />
    <div class="user-interface">
      <button class="show-video" on:click={() => showVideo()}> Exit </button>
    </div>
  </div>
</Hidable>

<style scoped>
  .stack {
    display: grid;
    grid-template: 1fr / 1fr;
    place-items: center;
    height: 100%;
    width: 100%;
  }

  .stack > * {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
    height: 100%;
    width: 100%;
  }

  .screen {
    z-index: 1;
  }

  .user-interface {
    z-index: 2;
  }

  #video > .user-interface {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
  }

  #canvas > .user-interface {

  }

  .show-canvas {
    margin-bottom: 1.5rem;
    background-color: transparent;
    border: 4px solid white;
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
  }

  .show-video {
  }
</style>
