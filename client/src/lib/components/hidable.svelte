<script lang="ts">
  export let hidden: boolean;
</script>

<div class="container" class:hidden={hidden}>
  <slot />
</div>

<style scoped>
  .container {
    display: contents;
  }

  .hidden {
    display: none;
  }
</style>
