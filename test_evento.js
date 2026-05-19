const url = "https://eyqfabyctclrugfiwsei.supabase.co/rest/v1/evento";
const headers = {
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cWZhYnljdGNscnVnZml3c2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTQzNjksImV4cCI6MjA5MjI3MDM2OX0.YpZaUEA5ls56f88_MFUZhhl2BxIsXUDXX_yI7zDR02g",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cWZhYnljdGNscnVnZml3c2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTQzNjksImV4cCI6MjA5MjI3MDM2OX0.YpZaUEA5ls56f88_MFUZhhl2BxIsXUDXX_yI7zDR02g",
  "Content-Type": "application/json"
};

fetch(url, { method: "POST", headers, body: JSON.stringify({ nombre: "test", categoria: "test", dia: "test", hora: "test", escenario: "test", descripcion: "test" }) })
  .then(async r => {
    console.log(r.status);
    console.log(await r.text());
  })
  .catch(console.error);
