import {
  Uppy,
  Dashboard,
  Transloadit,
} from "https://releases.transloadit.com/uppy/v3.6.1/uppy.min.mjs";

const uppy = new Uppy()
  .use(Transloadit, {
    waitForEncoding: true,
    alwaysRunAssembly: true,
    params: {
      // To avoid tampering use signatures:
      // https://transloadit.com/docs/api/#authentication
      auth: {
        key: "45531af791364209babf4b8b39725855",
      },
      // It's often better store encoding instructions in your account
      // and use a template_id instead of adding these steps inline
      template_id: "0f6c85babcc74351a5746cd84c7f41b2",
    },
  })
  .use(Dashboard, {
    inline: true,
    target: "#browse",
    showProgressDetails: true,
    proudlyDisplayPoweredByUppy: false,
  })
  .on("complete", ({ transloadit }) => {
    // Due to waitForEncoding:&nbsp;true this is fired after encoding is done.
    // Alternatively, set waitForEncoding to false and provide a notify_url
    console.log(transloadit); // Array of Assembly Statuses
    let filesArray = [];
    transloadit.forEach((assembly) => {
      console.log(assembly.results); // Array of all encoding results
      if (assembly.results.compress_image) {
        console.log(assembly.results.compress_image); // Array of all encoding results
        assembly.results.compress_image.forEach((file) => {
          filesArray.push({ fileName: file.name, url: file.url + "&raw=1" });
        });
      }
    });

    if (filesArray.length < 1) return;

    const form = document.querySelector("form");
    const input = document.createElement("input");

    input.type = "text";
    input.name = "files";
    input.value = JSON.stringify(filesArray);
    input.style.display = "none";

    form.appendChild(input);
  })
  .on("error", (error) => {
    console.error(error);
  });
