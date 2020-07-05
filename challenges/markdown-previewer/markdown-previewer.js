let editor, preview;

function updatePreview() {
  const html = marked(
    editor.value,
    { breaks: true }
  );
  preview.innerHTML = html;
}

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === 'complete') {
    editor = document.getElementById('editor');
    preview = document.getElementById('preview');
    editor.addEventListener('keyup', updatePreview);
    updatePreview();
  }
});
