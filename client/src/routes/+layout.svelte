<script lang="ts">
  import './normalize.css'
  import './layout.css'
</script>

<div class="app">
  <div class="content">
    <slot  />
  </div>
  <div class="navigation">
    asdasd
  </div>
</div>

<style scoped>
  .app {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .content {
    min-height: 0;
    flex-grow: 1;
    background-color: transparent;
  }

  .navigation {
    display: flex;
    height: 4rem;
    border-radius: 1rem 1rem 0 0;
    background-color: #1a1a1a;
    /* max-width: 50rem; */
  }
</style>
