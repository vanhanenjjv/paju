<script lang="ts">
  export let index: number | undefined = undefined;
</script>

<div class="layer" style="z-index: {index};">
  <slot />
</div>

<style scoped>
  .layer {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
    height: 100%;
    width: 100%;
  }
</style>
