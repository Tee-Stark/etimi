/*
 * Applies a stored theme choice before first paint (no flash).
 * With no stored choice, CSS follows the system `prefers-color-scheme`.
 * Static string, no interpolation: nothing user-controlled reaches the page.
 */

export const THEME_STORAGE_KEY = "theme";

const script = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
