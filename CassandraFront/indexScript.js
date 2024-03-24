document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    console.log(email, password);

    var formData = {
      email: email,
      password: password,
    };

    fetch("https://localhost:7116/api/User", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.text(); // Prima odgovor kao string
      })
      .then((data) => {
        console.log(data);
        if (data === "Pogresna email adresa") {
          alert("Pogresna email adresa!!!");
        } else if (data === "Pogresna sifra") {
          alert("Pogresna sifra!!!");
        } else {
          window.open(`pocetna.html?data=${encodeURIComponent(data)}`, "_self");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
