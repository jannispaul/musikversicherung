<script>
  import Image from "../Image.svelte";
</script>

<section class="md:relative overflow-hidden md:h-screen">
  <div
    class="float-right md:w-1/2 px-x1p5 py-x3 md:p-x1p5 bg-gradient-secondary
    text-white md:mt-x2 md:mx-x1p5 md:relative md:z-10">
    <h3
      class="text-x5 md:text-x1p5 mb-x1 leading-tight md:mb-x0p5 font-medium ">
      Instrumentenversicherung so,
      <!-- <br class="md:hidden" /> -->
      wie sie sein sollte
    </h3>
    <p class="text-x2 mb-x1 md:text-x0p5 md:mb-x0p5">
      SINFONIMA für klassische Instrumente und I’M SOUND für elektronisches
      Equipment bieten eine sehr umfassende Allgefahrendeckung. Mit der
      Instrumentenversicherung und der Equipmentversicherung sind nahezu alle
      Beschädigungs- oder Verlustrisiken abgesichert.
    </p>
  </div>
  <div class="flex image md:absolute md:z-0 w-full top-0">
    <Image
      sizes="100vw"
      srcset={`/images/sax_lcabmf/sax_lcabmf_c_scale,w_200.jpg 200w, /images/sax_lcabmf/sax_lcabmf_c_scale,w_636.jpg 636w, /images/sax_lcabmf/sax_lcabmf_c_scale,w_923.jpg 923w, /images/sax_lcabmf/sax_lcabmf_c_scale,w_1160.jpg 1160w, /images/sax_lcabmf/sax_lcabmf_c_scale,w_1374.jpg 1374w, /images/sax_lcabmf/sax_lcabmf_c_scale,w_1567.jpg 1567w, /images/sax_lcabmf/sax_lcabmf_c_scale,w_1746.jpg 1746w, /images/sax_lcabmf/sax_lcabmf_c_scale,w_1921.jpg 1921w, /images/sax_lcabmf/sax_lcabmf_c_scale,w_2092.jpg 2092w, /images/sax_lcabmf/sax_lcabmf_c_scale,w_2160.jpg 2160w`}
      src="/images/sax_lcabmf/sax_lcabmf_c_scale,w_2160.jpg"
      alt="Saxophon mit anderen Musikern im Hintergrund"
      class="z-10 " />
  </div>
</section>
