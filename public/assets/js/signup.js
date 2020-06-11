//Once the sign up page has loaded, the script will run
$(document).ready(function () {
  // Store jQuery references to the email input field, the password input field, and the submit button

  const emailField = $("#email-input");
  const passField = $("#password-input");
  const nameField = $("#name-input");
  const submitBtn = $("#submitBtn");

  submitBtn.on("click", function (event) {
    //prevent refreshing the page
    event.preventDefault();

    //test that the button works
    console.log("submit button clicked");

    //grab the value of the email and password fields
    const userInfo = {
      user_email: emailField.val().trim(),
      password: passField.val().trim(),
      user_name: nameField.val().trim()
    };
    const userLogin = {
      email: userInfo.user_email,
      password: userInfo.password
    }

    //check that the information obtained is correct:
    console.log(userInfo.user_email, userInfo.password);

    //if either field is blank, exit the function
    if (!userInfo.user_email || !userInfo.password) {
      return;
    }

    //otherwise, make a post request to the api
    else {
      $.post("/api/users", userInfo)
        .then(function (result) {
          console.log(result);
          $.post("/api/login", userLogin).then(function () {
            window.location.replace("/dashboard");
          });
        })
        .catch(function (error) {
          bulmaToast.toast({ message: "Invalid email and password combination.", type: "is-danger", animate: { in: 'fadeIn', out: 'fadeOut' } });
        });
    }
  });
});
