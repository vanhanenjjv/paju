<script lang="ts">
</script>

<div class="stack">
  <slot />
</div>

<style scoped>
  .stack {
    display: grid;
    grid-template: 1fr / 1fr;
    place-items: center;
    height: 100%;
    width: 100%;
  }
</style>
