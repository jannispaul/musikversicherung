<script>
  import GoogleAnalytics from "../../components/GoogleAnalytics.svelte";
</script>

<style>
  #main:focus {
    outline: 0;
  }
</style>

<GoogleAnalytics />
<header
  class="w-full z-10 top-0 px-x1p5 py-x1p5 md:py-x0p5 md:px-x1p5 text-primary
  text-x2 md:text-x1 ">
  <div class="w-full lg:w-4/6 lg:mx-auto flex justify-between">
    <a rel="prefetch" href="/" class="block md:inline-block">
      <strong>
        Musikversicherung
        <span class="opacity-75 -ml-1">.com</span>
      </strong>
    </a>
    <a href="tel:+4951919313199" title="B!-Das Versicherungsbüro anrufen">
      T: +49 5191 931 31 99
    </a>
  </div>

</header>
<main class="mb-x3 md:mb-x1 mt-x1 relative z-0">
  <slot />
</main>
