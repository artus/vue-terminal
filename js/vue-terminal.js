new Vue({
    el: "#vue-terminal",
    template: `
    <div class="vue-terminal">
        <div class="vue-terminal-output"></div>
        <div class="vue-terminal-input-container">
            <div class="vue-terminal-prefix">{{prefix}}</div>
            <div class="vue-terminal-input"></div>
        </div>
    </div>
    `,
    data: {
        user: "visitor@artus.github.io",
        directory: "/~",
        suffix: "$",
        input: "",
        output: ""
    },
    computed: {
        prefix: function () {
            return `${this.user}${this.directory} ${this.suffix}`;
        }
    },
    methods: {

    }
})