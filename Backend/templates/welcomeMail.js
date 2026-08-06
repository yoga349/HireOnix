export const welcomeEmail = (name) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">

    <h1 style="color:#2563eb;">Welcome to Hireonix 🚀</h1>

    <p>Hello <strong>${name}</strong>,</p>

    <p>
      Thank you for joining <strong>Hireonix</strong>.
      We're excited to have you on board.
    </p>

    <p>
      You can now:
    </p>

    <ul>
      <li>Apply for jobs</li>
      <li>Save jobs</li>
      <li>Track your applications</li>
      <li>Connect with recruiters</li>
    </ul>

    <hr>

    <p>
      Happy Job Hunting ❤️
    </p>

    <h3>Team Hireonix</h3>

  </div>
  `;
};