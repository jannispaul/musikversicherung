<script>
  export let question;
  export let answer;
</script>

<div
  itemscope
  itemprop="mainEntity"
  itemtype="https://schema.org/Question"
  class="text-x2 md:text-x0p5 ">
  <div
    itemprop="name"
    class="w-full bg-transparent text-primary border-solid border-0 border-b
    md:border-b-x0p1 border-primary py-x0p5 md:py-x0p25 mb-x0p5 md:mb-x0p25">
    {question}
  </div>
  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
    <div
      itemprop="text"
      class="mb-x1 md:mb-x1 opacity-75"
      contenteditable="false"
      bind:innerHTML={answer} />
  </div>
</div>
