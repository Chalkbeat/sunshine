require("./copy-box");
var $ = require("./lib/qsa");

$(".todays-date").forEach(el => el.innerHTML = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit'}).format(new Date()))