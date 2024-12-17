// Smooth scroll to the corresponding section on click of navigation buttons
document.querySelectorAll(".navigation-elements a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href"); // Get the href attribute (section ID)
    const targetSection = document.querySelector(targetId);

    // Get the height of the navbar
    const navbarHeight = document.querySelector(".navigation").offsetHeight;

    // Smooth scroll to the target section
    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - navbarHeight + 1,
        behavior: "smooth",
      });
    }
  });
});

// Smooth scroll for buttons in intro-section and navigation
document
  .querySelectorAll(".intro-section button, .navigation button")
  .forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const targetLink = e.currentTarget.closest("a");
      if (targetLink) {
        const targetId = targetLink.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        const navbarHeight = document.querySelector(".navigation").offsetHeight;

        // Smooth scroll to the target section
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - navbarHeight + 1,
            behavior: "smooth",
          });
        }
      }
    });
  });

// NavBar color change on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navigation");
  const aboutSection = document.querySelector(".about-section");

  if (navbar && aboutSection) {
    const aboutRect = aboutSection.getBoundingClientRect();
    const navRect = navbar.getBoundingClientRect();

    // Check if the .about-section is on screen
    if (navRect.bottom >= aboutRect.top) {
      navbar.style.backgroundColor = "#ffffff";
    } else {
      navbar.style.backgroundColor = "#d6f8d7";
    }
  }
});

// NavBar scroll state change
const scrollThreshold = 100; // Define a threshold for scroll class toggle
const navbar = document.querySelector(".navigation");

window.addEventListener("scroll", () => {
  if (navbar) {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add("scrolled"); // Add 'scrolled' class
    } else {
      navbar.classList.remove("scrolled"); // Remove 'scrolled' class
    }
  }
});

// Drop area functionality with ML model integration
const dropArea = document.getElementById("drop-area");
if (dropArea) {
  const desc = dropArea.querySelector(".desc"); // Description text
  const resultOutput = document.querySelector(".stage-result-output"); // Result output
  const resultDescription = document.querySelector(".stage-result-description"); // Result description

  // Prevent default drag behaviors to enable drop
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Highlight drop area on drag over
  dropArea.addEventListener("dragover", () => {
    dropArea.classList.add("drag-over");
    if (desc) desc.textContent = "Release to upload retinal image";
  });

  // Remove highlight on drag leave
  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("drag-over");
    if (desc) desc.textContent = "Click or Drag & Drop Retinal Image";
  });

  // Handle file drop
  dropArea.addEventListener("drop", (event) => {
    dropArea.classList.remove("drag-over");
    const files = event.dataTransfer.files;
    handleFiles(files);
  });

  // Handle click to open file selector
  dropArea.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Only allow image files
    fileInput.multiple = false;
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    fileInput.addEventListener("change", (event) => {
      const files = event.target.files;
      handleFiles(files);
      fileInput.remove(); // Cleanup
    });

    fileInput.click();
  });

  // Function to predict diabetic retinopathy stage
  async function predictRetinopathyStage(file) {
    // Show loading state
    if (resultOutput) resultOutput.textContent = "Analyzing...";
    if (resultDescription)
      resultDescription.textContent = "Processing retinal image";

    try {
      // Convert file to base64 or prepare for model input
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async (e) => {
        const imageBase64 = e.target.result;

        try {
          console.log("Sending image for prediction:", {
            fileType: file.type,
            fileSize: file.size,
          });

          const response = await fetch("http://localhost:5000/home", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: imageBase64,
            }),
          });

          console.log("Response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error("Prediction failed: " + errorText);
          }

          const predictionResult = await response.json();
          console.log("Prediction result:", predictionResult);

          // Update UI with prediction results
          if (resultOutput)
            resultOutput.textContent = `Stage: ${predictionResult.stage}`;

          // Provide more detailed description based on stage
          const stageDescriptions = {
            0: "No Diabetic Retinopathy Detected",
            1: "Mild Non-Proliferative Diabetic Retinopathy",
            2: "Moderate Non-Proliferative Diabetic Retinopathy",
            3: "Severe Non-Proliferative Diabetic Retinopathy",
            4: "Proliferative Diabetic Retinopathy",
          };

          if (resultDescription) {
            resultDescription.textContent =
              stageDescriptions[predictionResult.stage] ||
              "Unable to classify diabetic retinopathy stage";
          }

          // Optional: Display original image
          displayUploadedImage(imageBase64);
        } catch (predictionError) {
          console.error("Detailed Prediction Error:", predictionError);
          if (resultOutput) resultOutput.textContent = "Prediction Failed";
          if (resultDescription)
            resultDescription.textContent =
              predictionError.message || "Unable to process the image";
        }
      };
    } catch (error) {
      console.error("Initial Error:", error);
      if (resultOutput) resultOutput.textContent = "Error Processing Image";
      if (resultDescription)
        resultDescription.textContent =
          "Please try again with a different image";
    }
  }

  // Function to display uploaded image
  function displayUploadedImage(imageBase64) {
    // Create an image element to display the uploaded image
    const imageContainer = document.querySelector(".uploaded-image-container");
    if (imageContainer) {
      imageContainer.innerHTML = ""; // Clear previous image
      const imgElement = document.createElement("img");
      imgElement.src = imageBase64;
      imgElement.alt = "Uploaded Retinal Image";
      imgElement.classList.add("uploaded-image");
      imageContainer.appendChild(imgElement);
    }
  }

  // Centralized function to handle file processing
  function handleFiles(files) {
    if (!files || files.length === 0) {
      resetUI("No files selected");
      return;
    }

    // Validate file selection
    const file = files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB max file size

    if (!allowedTypes.includes(file.type)) {
      resetUI("Invalid file type. Please upload JPEG or PNG images.");
      return;
    }

    if (file.size > maxFileSize) {
      resetUI("File is too large. Maximum size is 5MB.");
      return;
    }

    // Update UI with file details and start prediction
    if (desc) desc.textContent = `Uploaded: ${file.name}`;

    // Call prediction function
    predictRetinopathyStage(file);
  }

  // Centralized UI reset function
  function resetUI(message) {
    if (desc)
      desc.textContent = message || "Click or Drag & Drop Retinal Image";
    if (resultOutput) resultOutput.textContent = "No Files";
    if (resultDescription)
      resultDescription.textContent = "Please upload a valid retinal image.";
  }
}
