export const statusMail = (
  candidateName,
  jobTitle,
  status
) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">

    <h1 style="color:#2563eb;">
      Application Status Updated 📢
    </h1>

    <p>Hello <strong>${candidateName}</strong>,</p>

    <p>
      Your application for
      <strong>${jobTitle}</strong>
      has been updated.
    </p>

    <h2>Status: ${status}</h2>

    <p>
      Login to Hireonix to view more details.
    </p>

    <hr>

    <h3>Best Wishes,<br>Team Hireonix</h3>

  </div>
  `;
};