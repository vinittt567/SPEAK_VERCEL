const testData = {
  email: "test.student@ju.ac.in",
  password: "password123"
};

const response = await fetch("http://localhost:3000/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(testData),
});

const result = await response.json();
console.log("Status:", response.status);
console.log("Response:", JSON.stringify(result, null, 2));