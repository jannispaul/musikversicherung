<script>
  import Image from "../Image.svelte";
</script>

<style>
  :global(.bg-gradient) {
    background: linear-gradient(228.42deg, #412b75 4.06%, #6b46c1 94.06%);
    background: #6b46c1;
  }
  :global(.bg-gradient-secondary) {
    background: linear-gradient(240.83deg, #db0086 4.06%, #960075 94.06%);
    background: #cf208c;
  }

  @media (min-width: 768px) {
    .content {
      background: linear-gradient(240.83deg, #db0086 4.06%, #960075 94.06%);
      background: #cf208c;

      min-width: 40vw;
      max-width: 45vw;
    }
    .bg-gradient-secondary {
      background: none;
    }
  }
</style>

<section
  class="bg-gradient-secondary p-x1p5 py-x3 md:py-x2 w-100 text-light md:flex
  relative items-center">
  <div class="hidden md:inline-block order-2">
    <Image
      sizes="(max-width: 2160px) 100vw, 2160px"
      srcset={`/images/drums_ulbs6v/drums_ulbs6v_c_scale,w_200.jpg 200w, /images/drums_ulbs6v/drums_ulbs6v_c_scale,w_630.jpg 630w, /images/drums_ulbs6v/drums_ulbs6v_c_scale,w_914.jpg 914w, /images/drums_ulbs6v/drums_ulbs6v_c_scale,w_1155.jpg 1155w, /images/drums_ulbs6v/drums_ulbs6v_c_scale,w_1343.jpg 1343w, /images/drums_ulbs6v/drums_ulbs6v_c_scale,w_1543.jpg 1543w, /images/drums_ulbs6v/drums_ulbs6v_c_scale,w_1721.jpg 1721w, /images/drums_ulbs6v/drums_ulbs6v_c_scale,w_1906.jpg 1906w, /images/drums_ulbs6v/drums_ulbs6v_c_scale,w_2078.jpg 2078w, /images/drums_ulbs6v/drums_ulbs6v_c_scale,w_2160.jpg 2160w`}
      src="/images/drums_ulbs6v/drums_ulbs6v_c_scale,w_2160.jpg"
      alt="Schlagzeuger mit Band im Hintergrund" />
  </div>

  <div
    class="content md:p-x1p5 text-light md:relative md:z-10 md:flex flex-col
    mw-x5 ">
    <h3
      class="text-x6 md:text-x1p5 mb-x1 leading-tight md:mb-x0p5 font-medium ">
      Keine
      <br class="md:hidden" />
      Selbstbeteiligung
    </h3>
    <p class="text-x2 mb-x1 md:text-x0p25 md:mb-0">
      Mit einer Instrumentenversicherung musst Du Dir nach einer Beschädigung
      keine Sorgen um die Reparaturkosten machen. Auch die Kosten für ein
      Leihinstrument während der Reparatur übernimmt die
      Instrumentenversicherung. Nach einem Verlust, zum Beispiel durch
      Diebstahl, hilft die Auszahlung der Versicherungssumme beim Kauf eines
      Ersatzinstrumentes. Bei der SINFONIMA-Instrumentenversicherung gibt es
      keine Selbstbeteiligung. Bei der I’M SOUND-Equipmentversicherung gilt nur
      für wenige Spezialfälle ein Selbstbehalt.
    </p>
  </div>

</section>
