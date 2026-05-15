function sendMsg() {
  const name  = document.getElementById('fn').value.trim();
  const email = document.getElementById('fe').value.trim();
  const msg   = document.getElementById('fm').value.trim();

 
  if (!name || !email || !msg) {
    alert('Please fill in all fields 💕');
    return;
  }


  document.getElementById('smsg').style.display = 'block';
  document.getElementById('fn').value = '';
  document.getElementById('fe').value = '';
  document.getElementById('fm').value = '';
}