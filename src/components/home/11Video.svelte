<script>
  import Youtube from "../Youtube.svelte";
</script>

<style>
  .video-container {
    width: 60vw;
    height: 34vw;
  }
  @media (max-width: 767px) {
    .bg-gradient-secondary {
      background: none;
    }
    .video-container {
      width: 100%;
      height: 100%;
    }
  }
</style>

<section
  id="ueber-mich"
  class=" px-x1p5 pb-x3 md:py-x2 w-100 md:flex relative items-center">
  <div class="video-container">
    <Youtube
      videoId="F2IZ9GeyaSs"
      title="Heiner Blaskewitz von B!-Das Versicherungsbüro stellt sich vor"
      class="-mr-x1p5 -ml-x1p5 mb-x2 md:m-0 " />
  </div>
  <div
    class="bg-gradient-secondary md:p-x1 md:relative md:z-0 md:flex flex-col
    mw-x5 md:w-1/2">
    <h3
      class="text-x6 text-primary md:text-light md:text-x1 mb-x1 leading-tight
      md:mb-x0p5 font-medium whitespace-no-wrap">
      Wer ist der Typ hinter
      <br />
      musikversicherung.com?
    </h3>
    <p class="text-x2 mb-x1 md:text-x0p25 md:mb-0 md:text-light ">
      Wenn Du wissen willst, mit wem Du es zu tun hast, schau Dir dieses kleine
      Video an. Hier erfährst Du, wer ich bin und was mich antreibt. Viel Spaß!
    </p>
  </div>

</section>
