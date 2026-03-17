const btn = document.getElementById('button');

          document.getElementById('form')
.addEventListener('submit', function(event) {

        event.preventDefault();

    btn.value = 'Sending...';

    const siddy = 'default_service';
    const temppy = 'template_lvv2727';

    emailjs.sendForm(siddy, temppy, this)
  .then(() => {
        btn.value = 'Send Me The Newsletter';
    showToast("Check your email (and junk folder) for the newsletter!");
    document.getElementById("form").reset();
  }, (err) => {


    btn.value = 'Send Me The Newsletter';
    showToast("Email failed to send. Please try again.");



    console.log(err);
  });


});


  function showToast(n){
    const bigT = document.getElementById("toast");
    bigT.textContent = n;
    bigT.classList.add("show");


    setTimeout(() => {
      bigT.classList.remove("show");
    }, 4500);
  }
