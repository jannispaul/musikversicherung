<script>
  let rating = 5;
  import Layout from "./_layouts/layout.svelte";
</script>

<style>

</style>

<Layout>
  <div class="text-x2 md:text-x1 lg:text-x0p5 px-x1p5 md:w-4/6">
    <h1 class="text-x4 md:text-x2 text-primary mb-x2 md:mb-x0p5 md:mt-x2">
      Diese Seite konnte leider nicht gefunden werden.
    </h1>

    <p>
      Bitte gib mir bescheid, dass dieser Link nicht mehr funktioniert:
      <br />
      <a
        href="mailto:info@musikversicherung.com?subject=Report%20404:%20Seite%20nicht%20gefunden&amp;body=Hallo%20Herr%20Blaskewitz%2C%20der%20folgender%20Link%20funktioniert%20leider%20nicht%20mehr%3A%20%3Chier%20LINK%20einsetzten%3E"
        class="underline"
        title="Einen Fehler melden">
        info@musikversicherung.com
      </a>
    </p>
  </div>

</Layout>
