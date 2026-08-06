export const applicationMail = (
  candidateName,
  jobTitle
) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px;">

    <h1 style="color:#16a34a;">
      New Job Application 📄
    </h1>

    <p>Hello Recruiter,</p>

    <p>
      <strong>${candidateName}</strong>
      has applied for your job:
    </p>

    <h2>${jobTitle}</h2>

    <p>
      Login to Hireonix to review the application.
    </p>

    <hr>

    <h3>Hireonix Recruitment Team</h3>

  </div>
  `;
};