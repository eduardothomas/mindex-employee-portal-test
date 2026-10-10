const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 4173;
const publicDirectory = path.join(__dirname, "public");
const mimeTypes = { ".css": "text/css", ".js": "text/javascript", ".html": "text/html", ".json": "application/json", ".svg": "image/svg+xml" };

const employee = {
  id: "EMP-10284", name: "Eduardo Thomas", role: "Employee", title: "Software Engineer", department: "Product Engineering",
  nextPayment: { amount: 2679.65, date: "15 de septiembre" }, vacation: { available: 12, used: 8, accrued: 20 },
  payroll: [
    { id: "pay-aug-31", date: "31 Ago 2026", month: "Agosto 2026", net: 2679.65, gross: 3500, status: "Disponible" },
    { id: "pay-aug-15", date: "15 Ago 2026", month: "Agosto 2026", net: 2679.65, gross: 3500, status: "Disponible" },
    { id: "pay-jul-31", date: "31 Jul 2026", month: "Julio 2026", net: 2650.2, gross: 3500, status: "Disponible" }
  ],
  documents: [
    { title: "Contrato laboral", category: "Laborales", date: "12 Ene 2024", type: "PDF" },
    { title: "Carta de trabajo", category: "Laborales", date: "30 Ago 2026", type: "PDF" },
    { title: "Comprobante Agosto", category: "Payroll", date: "31 Ago 2026", type: "PDF" },
    { title: "Reglamento interno", category: "Otros", date: "05 Ene 2026", type: "PDF" }
  ],
  notifications: [
    { id: 1, title: "Comprobante disponible", message: "Tu comprobante de agosto está disponible.", icon: "wallet", date: "Hoy", unread: true },
    { id: 2, title: "Vacaciones aprobadas", message: "Tu solicitud para diciembre fue aprobada.", icon: "sun", date: "Hoy", unread: true },
    { id: 3, title: "Nuevo documento", message: "RR. HH. publicó tu carta de trabajo.", icon: "file", date: "Ayer", unread: false }
  ],
  requests: [
    { id: "VAC-2026-00142", type: "Vacaciones", dates: "15 - 29 Dic 2026", days: 10, status: "Aprobada" },
    { id: "PER-2026-00018", type: "Cita médica", dates: "04 Sep 2026", days: 1, status: "Aprobada" }
  ]
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname === "/api/login" && request.method === "POST") {
    let body = "";
    request.on("data", chunk => body += chunk);
    request.on("end", () => {
      const { email, password } = JSON.parse(body || "{}");
      if (!email || !password) return sendJson(response, 400, { message: "Ingresa tu correo y contraseña." });
      const role = email.toLowerCase().includes("hr") ? "HR Admin" : email.toLowerCase().includes("manager") ? "Manager" : "Employee";
      sendJson(response, 200, { token: "demo-session-token", user: { ...employee, role } });
    });
    return;
  }
  if (url.pathname === "/api/dashboard") return sendJson(response, 200, employee);
  if (url.pathname === "/api/vacation-requests" && request.method === "POST") {
    let body = "";
    request.on("data", chunk => body += chunk);
    request.on("end", () => {
      const requestData = JSON.parse(body || "{}");
      const entry = { id: `VAC-2026-${String(employee.requests.length + 143).padStart(5, "0")}`, type: "Vacaciones", status: "Pendiente", ...requestData };
      employee.requests.unshift(entry);
      sendJson(response, 201, entry);
    });
    return;
  }
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(publicDirectory, path.normalize(requestedPath));
  if (!filePath.startsWith(publicDirectory)) return response.end("Not found");
  fs.readFile(filePath, (error, file) => {
    if (error) return response.writeHead(404).end("Not found");
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(file);
  });
});

server.listen(port, () => console.log(`Employee Portal disponible en http://localhost:${port}`));
