<script>
  export let rating = 0;
  export let isIndicatorActive = false;
  export let style = {
    styleStarWidth: 20,
    styleEmptyStarColor: "#D0D0D0",
    styleFullStarColor: "#ffd219"
  };

  let emptyStar = 0;
  let fullStar = 5;
  let totalStars = 5;
  let stars = [];

  function initStars() {
    for (let i = 0; i < totalStars; i++) {
      stars.push({
        raw: emptyStar,
        percent: emptyStar + "%"
      });
    }
  }

  function calcStarFullness(starData) {
    let starFullnessPercent = starData.raw * 100 + "%";
    return starFullnessPercent;
  }

  function setStars() {
    let fullStarsCounter = Math.floor(rating);

    for (let i = 0; i < stars.length; i++) {
      if (fullStarsCounter !== 0) {
        stars[i].raw = fullStar;
        stars[i].percent = calcStarFullness(stars[i]);
        fullStarsCounter--;
      } else {
        let surplus = Math.round((rating % 1) * 10) / 10; // Support just one decimal
        let roundedOneDecimalPoint = Math.round(surplus * 10) / 10;
        stars[i].raw = roundedOneDecimalPoint;
        return (stars[i].percent = calcStarFullness(stars[i]));
      }
    }
  }

  function getFullFillColor(starData) {
    return starData.raw !== emptyStar
      ? style.styleFullStarColor
      : style.styleEmptyStarColor;
  }

  initStars();
  setStars();
</script>

<style>
  .star-rating {
    display: flex;
    align-items: center;
  }
  .star-container {
    display: flex;
  }
  .indicator {
    font-size: 2.5rem;
  }
</style>

<div class="star-container">
  <div class="star-rating">
    {#each stars as star, index}
      <svg
        viewBox="0 0 {style.styleStarWidth}
        {style.styleStarWidth}"
        xmlns="http://www.w3.org/2000/svg"
        class="star-svg w-x1 md:w-stars-md lg:w-x0p5"
        style="fill: url(#gradient{index});">
        <path
          d="M.476 6.952l7.159-.178L9.955 0l2.382 6.754 7.16.114-5.687 4.351
          2.104 6.845L10.018 14l-5.86 4.116 2.043-6.863z" />
        <defs>
          <linearGradient id="gradient{index}">
            <stop
              offset={star.percent}
              stop-opacity="1"
              stop-color={getFullFillColor(star)}
              class="star-svg stop1" />
            <stop
              class="stop2"
              offset={star.percent}
              stop-opacity="0"
              stop-color={getFullFillColor(star)} />
            <stop
              class="stop3"
              offset={star.percent}
              stop-opacity="1"
              stop-color={style.styleEmptyStarColor} />
            <stop
              class="stop4"
              offset="100%"
              stop-opacity="1"
              stop-color={style.styleEmptyStarColor} />

          </linearGradient>
        </defs>
      </svg>
    {/each}
    {#if isIndicatorActive}
      <div class="indicator" itemprop="ratingValue">{rating}</div>
    {/if}
  </div>
</div>
