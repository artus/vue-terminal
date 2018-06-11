<template>
<div class="vue-terminal" @click="focus">
        <ul class="vue-terminal-output-container">
            <li :key="entry" v-for="entry in output">
                <pre :key="line" v-for="line in entry.split('\\n')"><span>{{line}}</span></pre>
            </li>
        </ul>
        <div class="vue-terminal-input-container">
            <div class="vue-terminal-prefix">{{prefix}}</div>
            <span :id="inputId" :class="{ focused : isFocused }" @keyup="keyUp" class="vue-terminal-input" contenteditable="true"></span>
        </div>
    </div>
</template>

<script>
export default {

  /**
   * Properties passed from parent.
   */
  props: {
    commands: {
      type: Object,
      default: {
        help: `$ help
$ clear
$ ls
$ cat`,
        clear: "exec clear",
        ls: "artus.txt skills.txt cat.txt \n",
        cat: "Specify the file you want to open... \n",
        "cat artus.txt": `\nMy name is Artus Vranken, and I am an avid software developer.
I'm always open to new challenges and aim to improve my skills each day.\n`,
        "cat cat.txt": `
　 ／l、     Meow :3
ﾞ（ﾟ､ ｡ ７
　 l、ﾞ ~ヽ
　 じしf_, )ノ
`,
        "cat skills.txt": `
Frontend:
    JS/html/css ★★★★
    Angular     ★★★
    Vue         ★★★

Backend:
    Java        ★★★★
    Spring      ★★
    Node.js     ★★★★

A bit of both:
    TypeScript  ★★★

A bit of everything else:
    Bash/Sh     ★★★★
    Docker      ★★★★
      -compose  ★★★
    Blockchain  ★★★
`
      }
    },
    user: {
      type: String,
      default: "visitor@artus.github.io"
    }
  },

  /**
   * Data that's being tracked by this component.
   */
  data: function() {
    return {
      directory: "/~",
      suffix: "$",
      history: new Array(),
      historyIndex: 0,
      input: "",
      output: new Array(),
      inputId: Math.floor(Math.random() * 1000)
    };
  },

  /**
   * Computed values.
   */
  computed: {
    prefix: function() {
      return `${this.user}${this.directory} ${this.suffix}`;
    }
  },

  /** 
   * Methods.
   */
  methods: {

    /**
     * Check if the contenteditable span is in focus.
     */
    isFocused: function() {
      return document.activeElement.id == this.inputId;
    },

    /**
     * Set the focus to the contenteditable span.
     */
    focus: function() {
      while (document.activeElement.id != this.inputId) {
        document.getElementById(this.inputId).focus();
      }
    },

    /**
     * Perform specified actions when a keyUp event is fired.
     * 
     * @param {eventArgs} e - The Event object.
     */
    keyUp: function(e) {
      switch (e.keyCode) {
        case 13:
          e.preventDefault();
          this.execute();
          break;

        case 38:
          e.preventDefault();
          this.previousHistory();
          break;
        case 40:
          e.preventDefault();
          this.nextHistory();
          break;
      }

      this.updateInputValue();
    },

    /**
     * Update the "input" data-field based on the contents of the terminal input field.
     */
    updateInputValue: function() {
      this.input = document.getElementById(this.inputId).innerHTML;
    },

    /**
     * Update the terminal input field based on the contents of the "input" data-field.
     */
    updateFieldValue: function() {
      document.getElementById(this.inputId).innerHTML = this.input;
    },

    /**
     * Execute functions entered by the user, based on the "commands" data-object.
     */
    execute: function() {
      let tempInput = this.input.replace("<br>", "");
      tempInput = tempInput.replace("<div>", "");
      tempInput = tempInput.replace("</div>", "");
      this.historyIndex = 0;
      this.history.unshift(tempInput);

      let tempOutput = this.commands[tempInput];

      if (typeof tempOutput == "undefined")
        tempOutput = `Couldn't find command: ${tempInput}`;

      switch (tempOutput) {
        case "exec clear":
          this.clear();
          return;
          break;
      }

      this.output.push(`${this.prefix} ${tempInput}`);
      this.output.push(tempOutput);

      document.getElementById(this.inputId).innerHTML = "";
      this.input = "";
    },

    /**
     * Load previous command from history.
     */
    previousHistory: function() {
      if (this.historyIndex + 1 > this.history.length) return;
      this.input = this.history[this.historyIndex++];
      this.updateFieldValue();
    },

    /**
     * Load next command from history.
     */
    nextHistory: function() {
      if (this.historyIndex - 1 < 0) return;
      this.input = this.history[this.historyIndex--];
      this.updateFieldValue();
    },

    /**
     * Clear the input, both in the view as in the Vue instance.
     */
    clearInput: function() {
      document.getElementById(this.inputId).innerHTML = "";
      this.input = "";
    },

    /**
     * Clear the whole terminal screen.
     */
    clear: function() {
      this.output = new Array();
      this.clearInput();
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=VT323");

:root {
  --vt-font-family: "VT323", monospace;
  --vt-font-size: 20px;

  --vt-margin: 10px;
  --vt-padding: 5px;

  --vt-border: 3px solid lightgreen;

  --vt-background-color: black;
  --vt-color: lightgreen;
}

.vue-terminal,
.vue-terminal * {
  margin: 0;
  padding: 0;

  box-sizing: border-box;
}

.vue-terminal {
  position: relative;

  width: calc(100% - 2 * var(--vt-margin));
  height: calc(100% - 2 * var(--vt-margin));

  margin: var(--vt-margin);
  padding: var(--vt-padding);

  border: var(--vt-border);

  background-color: var(--vt-background-color);
  color: var(--vt-color);

  font-family: var(--vt-font-family);
  font-size: var(--vt-font-size);
}

.vue-terminal * {
  float: left;
}

.vue-terminal-output-container {
  width: 100%;
}

.vue-terminal-output-container li {
  list-style: none;
  text-decoration: none;
  width: 100%;
  padding: var(--vt-padding);
  padding-top: 0;
  padding-bottom: 0;
}

.vue-terminal-output-container li pre {
  width: 100%;
  padding: 0;
}

.vue-terminal-output-container li pre span {
  width: 100%;
  font-family: var(--vt-font-family);
  font-size: var(--vt-font-size);
  white-space: pre;
}

.vue-terminal-input-container {
  width: 100%;

  display: flex;
  flex-direction: row;

  justify-content: flex-start;
}

.vue-terminal-prefix {
  padding: var(--vt-padding);
  padding-top: 0;
  padding-bottom: 0;

  flex-shrink: 1;
}

.vue-terminal-input {
  border: 0;
  outline: none;

  background: transparent;

  font-family: var(--vt-font-family);
  font-size: var(--vt-font-size);
  color: transparent;
  text-shadow: 0 0 0 var(--vt-color);

  padding: 0;
  margin: var(--vt-padding);
  margin-top: 0;
  margin-bottom: 0;
}

.focused {
  border-right: 10px solid var(--vt-color);
}
</style>