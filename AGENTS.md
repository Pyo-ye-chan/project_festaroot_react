# Repository editing rules

## Encoding safety (mandatory)

- All source files must remain UTF-8.
- Preserve Korean text exactly unless the task explicitly asks to change that text.
- Never read or rewrite source files through an implicit Windows ANSI/CP949 encoding.
- Do not use Windows PowerShell `Get-Content`, `Set-Content`, `Out-File`, shell redirection (`>`/`>>`), or any whole-file rewrite command unless UTF-8 is specified explicitly and verified.
- Prefer a byte-safe patch operation (`apply_patch`) for small changes.
- When scripting is unavoidable, use an explicit UTF-8 API, for example Python `Path.read_text(encoding="utf-8")` and `Path.write_text(..., encoding="utf-8")`.
- Do not rewrite an entire JSX/JS file for a small className, column-width, or label change.

## Required validation after editing Korean source files

1. Inspect `git diff` and confirm that unrelated Korean strings did not change.
2. Check that the edited file contains none of these mojibake markers:
   - `�`
   - `占쏙옙`
   - `寃뚯떆`
   - `怨듦컻`
   - `鍮꾧났`
   - `?꾩`
3. Parse/build the edited JSX before reporting completion.
4. If unexpected encoding changes appear, revert the file and reapply only the intended patch with explicit UTF-8 handling.

## Scope control

- Keep diffs minimal and limited to the user's requested files and behavior.
- Do not redesign existing UI unless explicitly requested.
- Preserve existing API calls, state flow, handlers, and Korean labels outside the requested change.
