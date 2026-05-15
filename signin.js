document.getElementById("signupForm").addEventListener("submit", function(e){
  e.preventDefault();
  let phone = document.getElementById("phone").value.trim();
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let msg = document.getElementById("msg");
  if(!/^[0-9]{10}$/.test(phone)){
    msg.style.color = "red";
    msg.innerHTML = "Phone number must contain exactly 10 digits!";
    return;
  }
  if(password !== confirmPassword){
    msg.style.color = "red";
    msg.innerHTML = "Passwords do not match!";
    return;
  }
  let country = document.getElementById("country").value;

if(country === ""){
  msg.style.color = "red";
  msg.innerHTML = "Please select your country!";
  return;
}
  msg.style.color = "green";
  msg.innerHTML = "✅ Account created successfully! Redirecting...";
  setTimeout(function(){
    window.location.href = "shop.html";
  }, 1500);
});