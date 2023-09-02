<script lang="ts">
  import { onMount } from "svelte";
  import { hasCamera, promptDownload } from "$lib/functions";
  import { options, type CameraOptions } from "$lib/stores/camera";
  import Stack from "$lib/components/stack/stack.svelte";
  import Layer from "$lib/components/stack/layer.svelte";

  let video: HTMLVideoElement;
  let canvas: HTMLCanvasElement;
  let track: MediaStreamTrack | null = null;

  let resizeObserver: ResizeObserver
  let devices: MediaDeviceInfo[] = []

  function flipCamera() {
    $options.facing =
      $options.facing === "environment" ? "user" : "environment";
  }

  function capture(): void {
    try {
      // debugger
      const context = canvas.getContext("2d");

      if (!context) throw new Error("Failed to get canvas context.");

      context.canvas.width = video.videoWidth;
      context.canvas.height = video.videoHeight;

      if (flipped) {
        context.translate(context.canvas.width, 0);
        context.scale(-1, 1);
      }

      context.drawImage(
        video,
        0,
        0,
        context.canvas.width,
        context.canvas.height
      );

      const image = context.canvas.toDataURL("image/jpeg", 1.0);

      promptDownload({
        contents: image,
        fileName: "image.jpeg",
      });
    } catch (error) {
      console.error("Failed to capture image", error);
    }
  }

  onMount(async () => {
    if (!(await hasCamera())) {
      console.log("No camera detected.");
    } else {
      video.srcObject = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode:
            $options.facing === "environment" ? "environment" : "user",
          frameRate: { min: 20, ideal: 30, max: 60 },
          deviceId: $options.device?.id ?? undefined,
          width: {
            max: 3000,
          },
          height: {
            max: 3000,
          },
          aspectRatio: {
            exact: video.clientWidth / video.clientHeight,
          },
        },
        audio: false,
      });

      devices = await navigator.mediaDevices.enumerateDevices()

      video.onplaying = () => {
        console.log("Video playing");
      };

      const tracks = video.srcObject.getVideoTracks();
      if (tracks.length === 0) throw new Error("No video tracks found.");
      track = tracks[0];

      resizeObserver = new ResizeObserver(() => {
        if (!track) return;
        const parent = video.parentElement
        if (!parent) return
        const display = video.style.display
        video.style.display = 'none'
        track.applyConstraints({
          aspectRatio: {
            exact: parent.clientWidth / parent.clientHeight,
          }
        }).then(() => {
          video.style.display = display
          console.log(track?.getSettings())
        })
      })
      resizeObserver.observe(document.body)

      options.subscribe(options => (async () => {
        if (!track) return
        console.log(options)
        await track.applyConstraints({
          deviceId: options.device?.id ?? undefined
        })
        console.log(track.getSettings())
      })())

      // console.log(track.getConstraints())
      // console.log(track.getSettings())
      // await track.applyConstraints({
      //   width: {
      //     max: 1080,
      //   },
      //   height: {
      //     max: 1920,
      //   },
      //   aspectRatio: {
      //     exact: video.clientWidth / video.clientHeight
      //   }
      // })
      // console.log(track.getConstraints())
      // console.log(track.getSettings())
    }
  });

  $: flipped = $options.facing === "user" && $options.flipped;
</script>

<canvas bind:this={canvas} class="renderer" />

<Stack>
  <Layer index={1}>
    <video bind:this={video} class="camera" class:flipped autoplay playsinline>
      <!-- TODO: Figure out wtf this is. -->
      <track kind="captions" />
    </video>
  </Layer>
  <Layer index={2}>
    <div class="overlay">
      <div class="top">
        <div>
          {#each devices as device}
            <p on:click={() => $options.device = { id: device.deviceId }}>{device.label}</p>
          {/each}
        </div>
        <button class="flip-camera" on:click={() => flipCamera()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
      <div class="bottom">
        <button class="capture" on:click={() => capture()} />
      </div>
    </div>
  </Layer>
</Stack>

<style scoped>
  .renderer {
    display: none;
  }

  .camera {
    width: 100%;
    height: 100%;
    object-fit: unset;
  }

  .flipped {
    transform: scaleX(-1);
  }

  .overlay {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .overlay > .top {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .overlay > .bottom {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .flip-camera {
    background: none;
    border: none;
    height: 4rem;
    width: 4rem;
    color: white;
  }

  .capture {
    margin-bottom: 1.5rem;
    background-color: transparent;
    border: 4px solid white;
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
  }
</style>
