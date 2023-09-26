const TokenType = {
    Illegal: "ILLEGAL",
    Eof: "EOF",
    Ident: "IDENT",
    If: "if",
    Return: "return",
    True: "true",
    False: "false",
    Else: "else",
    Int: "INT",
    Assign: "=",
    NotEqual: "!=",
    Equal: "==",
    Plus: "+",
    Comma: ",",
    Semicolon: ";",
    LParen: "(",
    RParen: ")",
    LSquirly: "{",
    RSquirly: "}",
    Function: "FUNCTION",
    Let: "LET",
    Bang: "!",
    Dash: "-",
    ForwardSlash: "/",
    Asterisk: "*",
    LessThan: "<",
    GreaterThan: ">",
} as const;

type Token = {
    value: string;
    type: (typeof TokenType)[keyof typeof TokenType];
};

class Tokenizer {
    private position = 0;
    private peekPosition = 0;
    private ch: string | undefined;
    private input: string;

    constructor(_input: string) {
        this.input = _input;
        this.readChar();
        console.log({
            pos: this.position,
            ppos: this.peekPosition,
            ch: this.ch,
        });
    }

    private readChar() {
        if (this.peekPosition >= this.input.length) {
            this.ch = "\0";
        } else {
            this.ch = this.input[this.peekPosition];
        }

        this.position = this.peekPosition;
        this.peekPosition++;
    }
}

const text = "let x = 5;";
const tokenizer = new Tokenizer(text);
