const TokenTypes = {
    Eof: "EOF",
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
    Minus: "-",
    Slash: "/",
    Asterisk: "*",
    LT: "<",
    GT: ">",
    Identifier: "IDENT",
    Illegal: "ILLEGAL",
} as const;

type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes];

type Token = {
    value: string;
    type: TokenType;
};

function createToken(value: string, type: TokenType): Token {
    return { value, type };
}

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

    nextToken(): Token | undefined {
        this.skipWhitespace();
        let token: Token | undefined;

        switch (this.ch) {
            case "\0":
                token = createToken(this.ch, TokenTypes.Eof);
                break;
            case "+":
                token = createToken(this.ch, TokenTypes.Plus);
                break;
            case "-":
                token = createToken(this.ch, TokenTypes.Minus);
                break;
            case "*":
                token = createToken(this.ch, TokenTypes.Asterisk);
                break;
            case "/":
                token = createToken(this.ch, TokenTypes.Slash);
                break;
            case ",":
                token = createToken(this.ch, TokenTypes.Comma);
                break;
            case "<":
                token = createToken(this.ch, TokenTypes.LT);
                break;
            case ">":
                token = createToken(this.ch, TokenTypes.GT);
                break;
            case ";":
                token = createToken(this.ch, TokenTypes.Semicolon);
                break;
            case "(":
                token = createToken(this.ch, TokenTypes.LParen);
                break;
            case ")":
                token = createToken(this.ch, TokenTypes.RParen);
                break;
            case "{":
                token = createToken(this.ch, TokenTypes.LSquirly);
                break;
            case "}":
                token = createToken(this.ch, TokenTypes.RSquirly);
                break;
            case "!":
                if (this.peekChar() === "=") {
                    this.readChar();
                    token = createToken("!=", TokenTypes.NotEqual);
                } else {
                    token = createToken(this.ch, TokenTypes.Bang);
                }

                break;
            case "=":
                if (this.peekChar() === "=") {
                    this.readChar();
                    token = createToken("==", TokenTypes.Equal);
                } else {
                    token = createToken(this.ch, TokenTypes.Assign);
                }

                break;
        }

        return token;
    }

    private skipWhitespace(): void {
        while (
            this.ch === " " ||
            this.ch === "\t" ||
            this.ch === "\r" ||
            this.ch === "\n"
        ) {
            this.readChar();
        }
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

    private peekChar(): string {
        if (this.peekPosition >= this.input.length) {
            return "\0";
        } else {
            return this.input[this.peekPosition];
        }
    }
}

const text = "let x = 5;";
const tokenizer = new Tokenizer(text);

while (true) {
    const token = tokenizer.nextToken();

    if (!token) break;

    console.log(token);
}
