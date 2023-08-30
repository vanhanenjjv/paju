<script lang="ts">
  import './layout.css'
</script>

<div class="page">
  <div class="device">
    <slot />
  </div>
</div>

<style scoped>
  .page {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .device {
    background: black;
    aspect-ratio: 9 / 16;
  }
</style>
