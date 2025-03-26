// Form submission handler
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simple form validation
      let isValid = true;
      const inputs = form.querySelectorAll("input");

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      });

      if (isValid) {
        // Here you would normally send the form data to a server
        // For this example, we'll just log the data
        const formData = new FormData(form);
        const formValues = {};

        for (const [key, value] of formData.entries()) {
          formValues[key] = value;
        }

        console.log("Form submitted:", formValues);

        // Reset the form
        form.reset();

        // Show a success message
        alert("Formulário enviado com sucesso!");
      }
    });
  }
});
