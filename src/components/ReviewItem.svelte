<script>
  export let review;
  import StarRatingSimple from "./StarRatingSimple.svelte";
</script>

<div
  class="text-x2 md:text-x0p5 border-solid border-0 border-t-2 border-primary
  pt-x0p5 mb-x0p5 md:mb-x0p25">
  <div class=" hidden">
    <span itemprop="name">SINFONIMA/I'M SOUND Instrumentenversicherung</span>
  </div>
  <div class="md:flex items-center my-x0p5 md:mt-0 md:mb-x0p25 ">
    <span>
      <span itemprop="ratingValue" class="hidden">{review.rating}</span>
      <!-- <span itemprop="bestRating" class="hidden">5</span> -->
      <StarRatingSimple rating={review.rating} class="" />
    </span>
    <span class="flex text-primary mt-x0p5 md:mt-0 md:text-x0p25">
      <span class="hidden md:inline">&nbsp;</span>
      von&nbsp;
      <span>
        <p>{review.name}</p>
      </span>
      &nbsp;am&nbsp;
      <p>{review.date}</p>
    </span>
  </div>
  <p class="mb-x0p5 md:mb-x0p25">
    {@html review.review}
  </p>
</div>
