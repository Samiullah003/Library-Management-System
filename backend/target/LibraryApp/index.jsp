<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Library Management System API</title>
  <style>
    body{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;background:#0b1b2b;color:#fbf8f2;margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center}
    .card{max-width:640px;padding:48px;border:1px solid rgba(255,255,255,.12);border-radius:24px;background:rgba(255,255,255,.03)}
    h1{font-size:30px;margin:0 0 8px;font-weight:600}
    p{color:#b9c6d4;line-height:1.6}
    code{background:rgba(198,155,72,.15);color:#e8c98a;padding:3px 8px;border-radius:6px;font-size:13px}
    ul{line-height:2.1;color:#dbe4ec;font-size:14px}
    a{color:#6fd3bb}
  </style>
</head>
<body>
  <div class="card">
    <h1>Library Management System &mdash; REST API</h1>
    <p>The Java Servlet backend is running. The React frontend runs separately on
       <code>http://localhost:5173</code>.</p>
    <ul>
      <li><code>GET&nbsp;&nbsp;/api/books</code> &mdash; catalogue, search &amp; filters</li>
      <li><code>GET&nbsp;&nbsp;/api/books/{id}</code> &mdash; single book</li>
      <li><code>POST /api/auth/login</code> &middot; <code>/api/auth/register</code></li>
      <li><code>GET&nbsp;&nbsp;/api/loans</code> &middot; <code>POST /api/loans</code></li>
      <li><code>GET&nbsp;&nbsp;/api/stats</code> &middot; <code>/api/categories</code></li>
    </ul>
  </div>
</body>
</html>
