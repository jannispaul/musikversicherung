window.addEventListener("LR_DATA_OUTPUT", (event) => {
  //   console.log("event", event.detail);

  // Create array to hold file names and urls
  let filesArray = [];

  // Push urls and names to filesArray
  event.detail?.data?.forEach((item) =>
    filesArray.push({ fileName: item.originalFilename, url: item.cdnUrl })
  );
  // If files array is empty skip the rest
  if (filesArray.length < 1) return;

  // Get form
  const form = document.querySelector("form");

  // Create a text input
  const input = document.createElement("input");

  input.type = "text";
  input.name = "files";
  // Set filesArray as string value
  input.value = JSON.stringify(filesArray);
  input.style.display = "none";

  // Append input to form
  form.appendChild(input);
});

// Transloadit implementation

// import {
//   Uppy,
//   DragDrop,
//   Transloadit,
//   StatusBar,
// } from "https://releases.transloadit.com/uppy/v3.6.1/uppy.min.mjs";

// const uppy = new Uppy()
//   .use(Transloadit, {
//     waitForEncoding: true,
//     alwaysRunAssembly: true,
//     params: {
//       // To avoid tampering use signatures:
//       // https://transloadit.com/docs/api/#authentication
//       auth: {
//         key: "45531af791364209babf4b8b39725855",
//       },
//       // It's often better store encoding instructions in your account
//       // and use a template_id instead of adding these steps inline
//       template_id: "0f6c85babcc74351a5746cd84c7f41b2",
//     },
//   })
//   .use(DragDrop, { target: "#browse" })
//   //   .use(Dashboard, {
//   //     inline: true,
//   //     target: "#browse",
//   //     showProgressDetails: true,
//   //     proudlyDisplayPoweredByUppy: false,
//   //   })
//   .use(StatusBar, { target: "#status-bar" })
//   .on("complete", ({ transloadit }) => {
//     // Due to waitForEncoding:&nbsp;true this is fired after encoding is done.
//     // Alternatively, set waitForEncoding to false and provide a notify_url

//     // Create array for files {filename, url}
//     let filesArray = [];
//     transloadit.forEach((assembly) => {
//       // If assembly result is a compressed image
//       if (assembly.results.compress_image) {
//         // Loop through thoses images
//         assembly.results.compress_image.forEach((file) => {
//           // Push name and url to filesArray
//           filesArray.push({ fileName: file.name, url: file.url + "&raw=1" });
//         });
//       }
//     });

//     // If files array is empty skip the rest
//     if (filesArray.length < 1) return;

//     // Get form
//     const form = document.querySelector("form");

//     // Create a text input
//     const input = document.createElement("input");

//     input.type = "text";
//     input.name = "files";
//     // Set filesArray as string value
//     input.value = JSON.stringify(filesArray);
//     input.style.display = "none";

//     // Append input to form
//     form.appendChild(input);
//   })
//   .on("error", (error) => {
//     console.error(error);
//   });
