Root Cause
Incorrect z-index, missing background CSS, or theme switching not updating the background container.

Fix
Set a dedicated background layer with a fixed z-index.

Ensure theme switch updates the background image for all screens.

Add responsive CSS for different screen sizes.

Code Suggestion
css
.background {
  position: absolute;
  z-index: -1;
  background-size: cover;
}
Status
Fix applied; needs cross-device testing.






