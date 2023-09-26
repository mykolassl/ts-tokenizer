const TokenTypes = {
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
    Bang: "!",
    Minus: "-",
    Slash: "/",
    Asterisk: "*",
    LT: "<",
    GT: ">",
    Eof: "EOF",
    Return: "RETURN",
    False: "FALSE",
    True: "TRUE",
    If: "IF",
    Else: "ELSE",
    Let: "LET",
    Function: "FUNCTION",
    Identifier: "IDENT",
    Int: "INT",
    Illegal: "ILLEGAL",
} as const;

const Keywords = {
    fn: TokenTypes.Function,
    let: TokenTypes.Let,
    else: TokenTypes.Else,
    false: TokenTypes.False,
    true: TokenTypes.True,
    return: TokenTypes.Return,
    if: TokenTypes.If,
} as const;

type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes];

type Token = {
    value: string;
    type: TokenType;
};

function createToken(value: string, type: TokenType): Token {
    return { value, type };
}

function isDigit(ch: string): boolean {
    return ch >= "0" && ch <= "9";
}

function isChar(ch: string): boolean {
    return (
        (ch >= "a" && ch <= "z") ||
        (ch >= "A" && ch <= "Z") ||
        ch === "_" ||
        ch === "$"
    );
}

class Tokenizer {
    private position = 0;
    private peekPosition = 0;
    private ch!: string;
    private input: string;

    constructor(_input: string) {
        this.input = _input;
        this.readChar();
    }

    nextToken(): Token {
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

        if (isChar(this.ch)) {
            const identifier = this.readIdentifier();
            const keywordType = Keywords[identifier as keyof typeof Keywords];

            if (keywordType) {
                token = createToken(identifier, keywordType);
            } else {
                token = createToken(identifier, TokenTypes.Identifier);
            }

            // Return early, because readIdentifier() moves cursor one position after digit ends

            return token;
        }

        if (isDigit(this.ch)) {
            const digit = this.readInteger();

            // Return early, because readInteger() moves cursor one position after digit ends

            return createToken(digit, TokenTypes.Int);
        }

        if (!token) {
            return createToken(this.ch, TokenTypes.Illegal);
        }

        this.readChar();

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

    private readChar(): void {
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

    private readIdentifier(): string {
        const pos = this.position;

        // a     abcdefg
        // ^^    ^-->---^

        while (isChar(this.ch)) {
            this.readChar();
        }

        return this.input.slice(pos, this.position);
    }

    private readInteger(): string {
        const pos = this.position;

        // 8     8888888
        // ^^    ^-->---^

        while (isDigit(this.ch)) {
            this.readChar();
        }

        return this.input.slice(pos, this.position);
    }
}

const text_1 = "let x = 5;";
const tokenizer = new Tokenizer(text_1);

while (true) {
    const token = tokenizer.nextToken();

    console.log(token);

    if (token?.type === "EOF") break;
}
