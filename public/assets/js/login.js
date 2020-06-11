$(document).ready(function () {
  // Store jQuery references to the email input field, the password input field, and the submit button

  const emailField = $("#email-input");
  const passField = $("#password-input");
  const submitBtn = $("#submitBtn");

  submitBtn.on("click", function (event) {
    //prevent refreshing the page
    event.preventDefault();

    //test that the button works
    console.log("submit button clicked");

    //grab the value of the email and password fields
    const userInfo = {
      email: emailField.val().trim(),
      password: passField.val().trim(),
    };

    //check that the information obtained is correct:
    console.log(userInfo.email, userInfo.password);

    //if either field is blank, exit the function
    if (!userInfo.email || !userInfo.password) {
      return;
    }

    //otherwise, make a post request to the api
    else {
      $.post("/api/login", userInfo)
        .then(function () {
          window.location.replace("/dashboard");
        })
        .catch(function (error) {
          bulmaToast.toast({ message: "Invalid email and password combination.", type: "is-danger", animate: { in: 'fadeIn', out: 'fadeOut' } });
        });
    }
  });
});
