# HEXA Gmail OTP Setup

This version removes the old local passcode login, guest mode, resume shortcut, saved-profile shortcut, and demo OTP flow.
The game home page opens only after the player verifies the 6-digit code sent by EmailJS.

## Your EmailJS IDs already added

- Service ID: `service_2ybwyj8`
- Template ID: `template_6o8hpkx`

## Add your EmailJS Public Key

Create a file named `.env` inside the `frontend` folder:

```env
VITE_EMAILJS_PUBLIC_KEY=4UY1fpnsNOopkvEzu
```

Your provided Public Key has already been added to `.env` and also as a safe fallback inside `src/App.jsx` for this assignment project.

## EmailJS template variables

Your EmailJS template should use these variable names:

```txt
{{to_email}}
{{to_name}}
{{otp_code}}
{{app_name}}
```

Make sure the template receiver/to email is set to:

```txt
{{to_email}}
```

## Run

```bash
npm install
npm run dev
```

## Important

This is real EmailJS email sending from the frontend, with no demo OTP fallback. For production security, OTP generation and verification should be moved to a backend server.
