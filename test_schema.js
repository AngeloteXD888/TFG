const url = "https://eyqfabyctclrugfiwsei.supabase.co/rest/v1/";
const headers = {
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cWZhYnljdGNscnVnZml3c2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTQzNjksImV4cCI6MjA5MjI3MDM2OX0.YpZaUEA5ls56f88_MFUZhhl2BxIsXUDXX_yI7zDR02g",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cWZhYnljdGNscnVnZml3c2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTQzNjksImV4cCI6MjA5MjI3MDM2OX0.YpZaUEA5ls56f88_MFUZhhl2BxIsXUDXX_yI7zDR02g"
};

fetch(url, { headers })
  .then(r => r.json())
  .then(data => {
    console.log(JSON.stringify(data, null, 2).substring(0, 1500));
  })
  .catch(console.error);
