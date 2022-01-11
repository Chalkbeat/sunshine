var template = `
<style>
:host {
  display: block;
  position: relative;
  padding: 10px;
}
.toast {
  display: none;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px;
  background: black;
  color: white;
  font-family: var(--sans);
  font-size: 14px;
  text-align: center;
}

textarea {
  display: none;
}

.toast.shown {
  display: block;
}
</style>
<textarea as="textarea"></textarea>
<slot as="slot"></slot>
<div class="toast" as="toast"></div>
`;

class CopyBox extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.onClick.bind(this));

    var root = this.attachShadow({ mode: "open" });
    root.innerHTML = template;

    this.elements = {};
    for (var e of root.querySelectorAll("[as]")) {
      this.elements[e.getAttribute("as")] = e;
    }

    this.toastTimer = null;
  }

  async copy(text) {
    if (window.navigator.clipboard) {
      await window.navigator.clipboard.writeText(text);
    } else {
      var input = this.elements.textarea;
      var range = document.createRange();
      input.removeAttribute("hidden");
      input.value = text;
      input.focus();
      input.select();
      range.selectNodeContents(input);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      input.setSelectionRange(0, text.length);
      var result = document.execCommand("copy");
      input.setAttribute("hidden", "");
    }
  }

  async onClick() {
    await this.copy(this.innerText);
    this.toast(`Copied!`);
  }

  get value() {
    return this.elements.textarea.value;
  }

  set value(v) {
    this.elements.textarea.value = v;
  }

  toast(text, time = 2000) {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    var { toast } = this.elements;
    toast.innerHTML = text;
    toast.classList.add("shown");
    this.toastTimer = setTimeout(() => {
      toast.classList.remove("shown");
      this.toastTimer = null;
      this.elements.textarea.selectionStart = 0;
      this.elements.textarea.selectionEnd = 0;
    }, time);
  }

}

window.customElements.define("copy-box", CopyBox);