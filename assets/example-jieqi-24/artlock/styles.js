// Loads styles/s01.js … s24.js in order (file:// friendly). A missing or unfinished style falls back to JQ.placeholder(n).
(function () { for (let n = 1; n <= 24; n++) document.write('<script src="styles/s' + String(n).padStart(2, '0') + '.js"><\/script>'); })();
