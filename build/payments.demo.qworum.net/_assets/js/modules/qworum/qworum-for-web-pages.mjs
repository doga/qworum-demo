/**
 * Qworum for web pages. This ES JavaScript library exports the Qworum class.
 * @author Doğa Armangil <d.armangil@qworum.net>
 * @license MIT License <https://opensource.org/licenses/MIT>
 * @see <https://qworum.net>
 */

// Cross-browser JavaScript module for web pages.
// Used for communicating with the browser's Qworum extension.
// (I will make this available on GitHub.)
// 
// How it works: see https://developer.chrome.com/docs/extensions/mv3/messaging/#external-webpage

// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class DataValue {
    static registry = [];
    toString() {
        throw new Error('not implemented');
    }
    static fromXmlElement(element, namespaceStack) {
        let errorMessage = 'Not valid data';
        for (const dataType of this.registry){
            try {
                const data = dataType.fromXmlElement(element, namespaceStack);
                return data;
            } catch (error) {
                errorMessage = `${error}`;
            }
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        throw new Error('not implemented');
    }
    static fromIndexedDb(encodedData) {
        let errorMessage = 'Not valid data';
        for (const dataType of this.registry){
            try {
                const data = dataType.fromIndexedDb(encodedData);
                return data;
            } catch (error) {}
        }
        throw new Error(errorMessage);
    }
    toIndexedDb() {
        throw new Error('not implemented');
    }
}
class GenericData extends DataValue {
    static namespace = new URL('https://qworum.net/ns/v1/data/');
    toString() {
        throw new Error('not implemented');
    }
    static fromXmlElement(element, namespaceStack) {
        let errorMessage = 'Not valid data';
        for (const dataType of this.registry){
            try {
                const data = dataType.fromXmlElement(element, namespaceStack);
                return data;
            } catch (error) {}
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        throw new Error('not implemented');
    }
    static fromIndexedDb(encodedData) {
        let errorMessage = 'Not valid data';
        for (const dataType of this.registry){
            try {
                const data = dataType.fromIndexedDb(encodedData);
                return data;
            } catch (error) {}
        }
        throw new Error(errorMessage);
    }
    toIndexedDb() {
        throw new Error('not implemented');
    }
}
'use strict';
const syntax = Object.create(null);
const predefinedEntities = Object.freeze(Object.assign(Object.create(null), {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    quot: '"'
}));
syntax['predefinedEntities'] = predefinedEntities;
function isNameChar(__char) {
    if (isNameStartChar(__char)) {
        return true;
    }
    let cp = getCodePoint(__char);
    return cp === 0x2D || cp === 0x2E || cp >= 0x30 && cp <= 0x39 || cp === 0xB7 || cp >= 0x300 && cp <= 0x36F || cp >= 0x203F && cp <= 0x2040;
}
syntax['isNameChar'] = isNameChar;
function isNameStartChar(__char) {
    let cp = getCodePoint(__char);
    return cp === 0x3A || cp === 0x5F || cp >= 0x41 && cp <= 0x5A || cp >= 0x61 && cp <= 0x7A || cp >= 0xC0 && cp <= 0xD6 || cp >= 0xD8 && cp <= 0xF6 || cp >= 0xF8 && cp <= 0x2FF || cp >= 0x370 && cp <= 0x37D || cp >= 0x37F && cp <= 0x1FFF || cp >= 0x200C && cp <= 0x200D || cp >= 0x2070 && cp <= 0x218F || cp >= 0x2C00 && cp <= 0x2FEF || cp >= 0x3001 && cp <= 0xD7FF || cp >= 0xF900 && cp <= 0xFDCF || cp >= 0xFDF0 && cp <= 0xFFFD || cp >= 0x10000 && cp <= 0xEFFFF;
}
syntax['isNameStartChar'] = isNameStartChar;
function isNotXmlChar(__char) {
    return !isXmlChar(__char);
}
syntax['isNotXmlChar'] = isNotXmlChar;
function isReferenceChar(__char) {
    return __char === '#' || isNameChar(__char);
}
syntax['isReferenceChar'] = isReferenceChar;
function isWhitespace(__char) {
    let cp = getCodePoint(__char);
    return cp === 0x20 || cp === 0x9 || cp === 0xA || cp === 0xD;
}
syntax['isWhitespace'] = isWhitespace;
function isXmlChar(__char) {
    let cp = getCodePoint(__char);
    return cp === 0x9 || cp === 0xA || cp === 0xD || cp >= 0x20 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFD || cp >= 0x10000 && cp <= 0x10FFFF;
}
syntax['isXmlChar'] = isXmlChar;
function getCodePoint(__char) {
    return __char.codePointAt(0) || -1;
}
const emptyString = '';
class StringScanner {
    constructor(string){
        this.chars = [
            ...string
        ];
        this.charCount = this.chars.length;
        this.charIndex = 0;
        this.charsToBytes = new Array(this.charCount);
        this.multiByteMode = false;
        this.string = string;
        let { chars , charCount , charsToBytes  } = this;
        if (charCount === string.length) {
            for(let i = 0; i < charCount; ++i){
                charsToBytes[i] = i;
            }
        } else {
            for(let byteIndex = 0, charIndex = 0; charIndex < charCount; ++charIndex){
                charsToBytes[charIndex] = byteIndex;
                byteIndex += chars[charIndex].length;
            }
            this.multiByteMode = true;
        }
    }
    get isEnd() {
        return this.charIndex >= this.charCount;
    }
    _charLength(string) {
        let { length  } = string;
        if (length < 2 || !this.multiByteMode) {
            return length;
        }
        return string.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '_').length;
    }
    advance(count = 1) {
        this.charIndex = Math.min(this.charCount, this.charIndex + count);
    }
    consume(count = 1) {
        let chars = this.peek(count);
        this.advance(count);
        return chars;
    }
    consumeMatch(regex) {
        if (!regex.sticky) {
            throw new Error('`regex` must have a sticky flag ("y")');
        }
        regex.lastIndex = this.charsToBytes[this.charIndex];
        let result = regex.exec(this.string);
        if (result === null) {
            return emptyString;
        }
        let match = result[0];
        this.advance(this._charLength(match));
        return match;
    }
    consumeMatchFn(fn) {
        let startIndex = this.charIndex;
        while(!this.isEnd && fn(this.peek())){
            this.advance();
        }
        return this.charIndex > startIndex ? this.string.slice(this.charsToBytes[startIndex], this.charsToBytes[this.charIndex]) : emptyString;
    }
    consumeString(stringToConsume) {
        if (this.consumeStringFast(stringToConsume)) {
            return stringToConsume;
        }
        if (!this.multiByteMode) {
            return emptyString;
        }
        let { length  } = stringToConsume;
        let charLengthToMatch = this._charLength(stringToConsume);
        if (charLengthToMatch !== length && stringToConsume === this.peek(charLengthToMatch)) {
            this.advance(charLengthToMatch);
            return stringToConsume;
        }
        return emptyString;
    }
    consumeStringFast(stringToConsume) {
        if (this.peek() === stringToConsume[0]) {
            let { length  } = stringToConsume;
            if (length === 1) {
                this.advance();
                return stringToConsume;
            }
            if (this.peek(length) === stringToConsume) {
                this.advance(length);
                return stringToConsume;
            }
        }
        return emptyString;
    }
    consumeUntilMatch(regex) {
        if (!regex.global) {
            throw new Error('`regex` must have a global flag ("g")');
        }
        let byteIndex = this.charsToBytes[this.charIndex];
        regex.lastIndex = byteIndex;
        let match = regex.exec(this.string);
        if (match === null || match.index === byteIndex) {
            return emptyString;
        }
        let result = this.string.slice(byteIndex, match.index);
        this.advance(this._charLength(result));
        return result;
    }
    consumeUntilString(searchString) {
        let { charIndex , charsToBytes , string  } = this;
        let byteIndex = charsToBytes[charIndex];
        let matchByteIndex = string.indexOf(searchString, byteIndex);
        if (matchByteIndex <= 0) {
            return emptyString;
        }
        let result = string.slice(byteIndex, matchByteIndex);
        this.advance(this._charLength(result));
        return result;
    }
    peek(count = 1) {
        if (this.charIndex >= this.charCount) {
            return emptyString;
        }
        if (count === 1) {
            return this.chars[this.charIndex];
        }
        let { charsToBytes , charIndex  } = this;
        return this.string.slice(charsToBytes[charIndex], charsToBytes[charIndex + count]);
    }
    reset(index = 0) {
        this.charIndex = index >= 0 ? Math.min(this.charCount, index) : Math.max(0, this.charIndex + index);
    }
}
class XmlNode {
    constructor(){
        this.parent = null;
    }
    get document() {
        return this.parent ? this.parent.document : null;
    }
    get isRootNode() {
        return this.parent ? this.parent === this.document : false;
    }
    get preserveWhitespace() {
        return Boolean(this.parent && this.parent.preserveWhitespace);
    }
    get type() {
        return '';
    }
    toJSON() {
        let json = {
            type: this.type
        };
        if (this.isRootNode) {
            json.isRootNode = true;
        }
        if (this.preserveWhitespace) {
            json.preserveWhitespace = true;
        }
        return json;
    }
}
XmlNode.TYPE_CDATA = 'cdata';
XmlNode.TYPE_COMMENT = 'comment';
XmlNode.TYPE_DOCUMENT = 'document';
XmlNode.TYPE_ELEMENT = 'element';
XmlNode.TYPE_PROCESSING_INSTRUCTION = 'pi';
XmlNode.TYPE_TEXT = 'text';
class XmlText extends XmlNode {
    constructor(text = ''){
        super();
        this.text = text;
    }
    get type() {
        return XmlNode.TYPE_TEXT;
    }
    toJSON() {
        return Object.assign(XmlNode.prototype.toJSON.call(this), {
            text: this.text
        });
    }
}
class XmlComment extends XmlNode {
    constructor(content = ''){
        super();
        this.content = content;
    }
    get type() {
        return XmlNode.TYPE_COMMENT;
    }
    toJSON() {
        return Object.assign(XmlNode.prototype.toJSON.call(this), {
            content: this.content
        });
    }
}
class XmlCdata extends XmlText {
    get type() {
        return XmlNode.TYPE_CDATA;
    }
}
class XmlProcessingInstruction extends XmlNode {
    constructor(name, content = ''){
        super();
        this.name = name;
        this.content = content;
    }
    get type() {
        return XmlNode.TYPE_PROCESSING_INSTRUCTION;
    }
    toJSON() {
        return Object.assign(XmlNode.prototype.toJSON.call(this), {
            name: this.name,
            content: this.content
        });
    }
}
class XmlElement extends XmlNode {
    constructor(name, attributes = Object.create(null), children = []){
        super();
        this.name = name;
        this.attributes = attributes;
        this.children = children;
    }
    get isEmpty() {
        return this.children.length === 0;
    }
    get preserveWhitespace() {
        let node = this;
        while(node instanceof XmlElement){
            if ('xml:space' in node.attributes) {
                return node.attributes['xml:space'] === 'preserve';
            }
            node = node.parent;
        }
        return false;
    }
    get text() {
        return this.children.map((child)=>'text' in child ? child.text : '').join('');
    }
    get type() {
        return XmlNode.TYPE_ELEMENT;
    }
    toJSON() {
        return Object.assign(XmlNode.prototype.toJSON.call(this), {
            name: this.name,
            attributes: this.attributes,
            children: this.children.map((child)=>child.toJSON())
        });
    }
}
class XmlDocument extends XmlNode {
    constructor(children = []){
        super();
        this.children = children;
    }
    get document() {
        return this;
    }
    get root() {
        return this.children.find((child)=>child instanceof XmlElement) || null;
    }
    get text() {
        return this.children.map((child)=>'text' in child ? child.text : '').join('');
    }
    get type() {
        return XmlNode.TYPE_DOCUMENT;
    }
    toJSON() {
        return Object.assign(XmlNode.prototype.toJSON.call(this), {
            children: this.children.map((child)=>child.toJSON())
        });
    }
}
class Parser {
    constructor(xml, options = Object.create(null)){
        this.document = new XmlDocument();
        this.currentNode = this.document;
        this.options = options;
        this.scanner = new StringScanner(normalizeXmlString(xml));
        this.consumeProlog();
        if (!this.consumeElement()) {
            this.error('Root element is missing or invalid');
        }
        while(this.consumeMisc()){}
        if (!this.scanner.isEnd) {
            this.error('Extra content at the end of the document');
        }
    }
    addNode(node) {
        node.parent = this.currentNode;
        this.currentNode.children.push(node);
    }
    addText(text) {
        let { children  } = this.currentNode;
        if (children.length > 0) {
            let prevNode = children[children.length - 1];
            if (prevNode instanceof XmlText) {
                prevNode.text += text;
                return;
            }
        }
        this.addNode(new XmlText(text));
    }
    consumeAttributeValue() {
        let { scanner  } = this;
        let quote = scanner.peek();
        if (quote !== '"' && quote !== "'") {
            return false;
        }
        scanner.advance();
        let chars;
        let isClosed = false;
        let value = emptyString;
        let regex = quote === '"' ? /[^"&<]+/y : /[^'&<]+/y;
        matchLoop: while(!scanner.isEnd){
            chars = scanner.consumeMatch(regex);
            if (chars) {
                this.validateChars(chars);
                value += chars.replace(/[\t\r\n]/g, ' ');
            }
            let nextChar = scanner.peek();
            switch(nextChar){
                case quote:
                    isClosed = true;
                    break matchLoop;
                case '&':
                    value += this.consumeReference();
                    continue;
                case '<':
                    this.error('Unescaped `<` is not allowed in an attribute value');
                    break;
                case emptyString:
                    this.error('Unclosed attribute');
                    break;
            }
        }
        if (!isClosed) {
            this.error('Unclosed attribute');
        }
        scanner.advance();
        return value;
    }
    consumeCdataSection() {
        let { scanner  } = this;
        if (!scanner.consumeStringFast('<![CDATA[')) {
            return false;
        }
        let text = scanner.consumeUntilString(']]>');
        this.validateChars(text);
        if (!scanner.consumeStringFast(']]>')) {
            this.error('Unclosed CDATA section');
        }
        if (this.options.preserveCdata) {
            this.addNode(new XmlCdata(text));
        } else {
            this.addText(text);
        }
        return true;
    }
    consumeCharData() {
        let { scanner  } = this;
        let charData = scanner.consumeUntilMatch(/<|&|]]>/g);
        if (!charData) {
            return false;
        }
        this.validateChars(charData);
        if (scanner.peek() === ']' && scanner.peek(3) === ']]>') {
            this.error('Element content may not contain the CDATA section close delimiter `]]>`');
        }
        this.addText(charData);
        return true;
    }
    consumeComment() {
        let { scanner  } = this;
        if (!scanner.consumeStringFast('<!--')) {
            return false;
        }
        let content = scanner.consumeUntilString('--');
        this.validateChars(content);
        if (!scanner.consumeStringFast('-->')) {
            if (scanner.peek(2) === '--') {
                this.error("The string `--` isn't allowed inside a comment");
            } else {
                this.error('Unclosed comment');
            }
        }
        if (this.options.preserveComments) {
            this.addNode(new XmlComment(content.trim()));
        }
        return true;
    }
    consumeContentReference() {
        let ref = this.consumeReference();
        if (ref) {
            this.addText(ref);
            return true;
        }
        return false;
    }
    consumeDoctypeDeclaration() {
        let { scanner  } = this;
        if (!scanner.consumeStringFast('<!DOCTYPE') || !this.consumeWhitespace()) {
            return false;
        }
        scanner.consumeMatch(/[^[>]+/y);
        if (scanner.consumeMatch(/\[[\s\S]+?\][\x20\t\r\n]*>/y)) {
            return true;
        }
        if (!scanner.consumeStringFast('>')) {
            this.error('Unclosed doctype declaration');
        }
        return true;
    }
    consumeElement() {
        let { scanner  } = this;
        let mark = scanner.charIndex;
        if (scanner.peek() !== '<') {
            return false;
        }
        scanner.advance();
        let name = this.consumeName();
        if (!name) {
            scanner.reset(mark);
            return false;
        }
        let attributes = Object.create(null);
        while(this.consumeWhitespace()){
            let attrName = this.consumeName();
            if (!attrName) {
                continue;
            }
            let attrValue = this.consumeEqual() && this.consumeAttributeValue();
            if (attrValue === false) {
                this.error('Attribute value expected');
            }
            if (attrName in attributes) {
                this.error(`Duplicate attribute: ${attrName}`);
            }
            if (attrName === 'xml:space' && attrValue !== 'default' && attrValue !== 'preserve') {
                this.error('Value of the `xml:space` attribute must be "default" or "preserve"');
            }
            attributes[attrName] = attrValue;
        }
        if (this.options.sortAttributes) {
            let attrNames = Object.keys(attributes).sort();
            let sortedAttributes = Object.create(null);
            for(let i = 0; i < attrNames.length; ++i){
                let attrName1 = attrNames[i];
                sortedAttributes[attrName1] = attributes[attrName1];
            }
            attributes = sortedAttributes;
        }
        let isEmpty = Boolean(scanner.consumeStringFast('/>'));
        let element = new XmlElement(name, attributes);
        element.parent = this.currentNode;
        if (!isEmpty) {
            if (!scanner.consumeStringFast('>')) {
                this.error(`Unclosed start tag for element \`${name}\``);
            }
            this.currentNode = element;
            this.consumeCharData();
            while(this.consumeElement() || this.consumeContentReference() || this.consumeCdataSection() || this.consumeProcessingInstruction() || this.consumeComment()){
                this.consumeCharData();
            }
            let endTagMark = scanner.charIndex;
            let endTagName;
            if (!scanner.consumeStringFast('</') || !(endTagName = this.consumeName()) || endTagName !== name) {
                scanner.reset(endTagMark);
                this.error(`Missing end tag for element ${name}`);
            }
            this.consumeWhitespace();
            if (!scanner.consumeStringFast('>')) {
                this.error(`Unclosed end tag for element ${name}`);
            }
            this.currentNode = element.parent;
        }
        this.addNode(element);
        return true;
    }
    consumeEqual() {
        this.consumeWhitespace();
        if (this.scanner.consumeStringFast('=')) {
            this.consumeWhitespace();
            return true;
        }
        return false;
    }
    consumeMisc() {
        return this.consumeComment() || this.consumeProcessingInstruction() || this.consumeWhitespace();
    }
    consumeName() {
        return syntax.isNameStartChar(this.scanner.peek()) ? this.scanner.consumeMatchFn(syntax.isNameChar) : emptyString;
    }
    consumeProcessingInstruction() {
        let { scanner  } = this;
        let mark = scanner.charIndex;
        if (!scanner.consumeStringFast('<?')) {
            return false;
        }
        let name = this.consumeName();
        if (name) {
            if (name.toLowerCase() === 'xml') {
                scanner.reset(mark);
                this.error("XML declaration isn't allowed here");
            }
        } else {
            this.error('Invalid processing instruction');
        }
        if (!this.consumeWhitespace()) {
            if (scanner.consumeStringFast('?>')) {
                this.addNode(new XmlProcessingInstruction(name));
                return true;
            }
            this.error('Whitespace is required after a processing instruction name');
        }
        let content = scanner.consumeUntilString('?>');
        this.validateChars(content);
        if (!scanner.consumeStringFast('?>')) {
            this.error('Unterminated processing instruction');
        }
        this.addNode(new XmlProcessingInstruction(name, content));
        return true;
    }
    consumeProlog() {
        let { scanner  } = this;
        let mark = scanner.charIndex;
        this.consumeXmlDeclaration();
        while(this.consumeMisc()){}
        if (this.consumeDoctypeDeclaration()) {
            while(this.consumeMisc()){}
        }
        return mark < scanner.charIndex;
    }
    consumeReference() {
        let { scanner  } = this;
        if (scanner.peek() !== '&') {
            return false;
        }
        scanner.advance();
        let ref = scanner.consumeMatchFn(syntax.isReferenceChar);
        if (scanner.consume() !== ';') {
            this.error('Unterminated reference (a reference must end with `;`)');
        }
        let parsedValue;
        if (ref[0] === '#') {
            let codePoint = ref[1] === 'x' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
            if (isNaN(codePoint)) {
                this.error('Invalid character reference');
            }
            parsedValue = String.fromCodePoint(codePoint);
            if (!syntax.isXmlChar(parsedValue)) {
                this.error('Character reference resolves to an invalid character');
            }
        } else {
            parsedValue = syntax.predefinedEntities[ref];
            if (parsedValue === undefined) {
                let { ignoreUndefinedEntities , resolveUndefinedEntity  } = this.options;
                let wrappedRef = `&${ref};`;
                if (resolveUndefinedEntity) {
                    let resolvedValue = resolveUndefinedEntity(wrappedRef);
                    if (resolvedValue !== null && resolvedValue !== undefined) {
                        let type = typeof resolvedValue;
                        if (type !== 'string') {
                            throw new TypeError(`\`resolveUndefinedEntity()\` must return a string, \`null\`, or \`undefined\`, but returned a value of type ${type}`);
                        }
                        return resolvedValue;
                    }
                }
                if (ignoreUndefinedEntities) {
                    return wrappedRef;
                }
                scanner.reset(-wrappedRef.length);
                this.error(`Named entity isn't defined: ${wrappedRef}`);
            }
        }
        return parsedValue;
    }
    consumeSystemLiteral() {
        let { scanner  } = this;
        let quote = scanner.consumeStringFast('"') || scanner.consumeStringFast("'");
        if (!quote) {
            return false;
        }
        let value = scanner.consumeUntilString(quote);
        this.validateChars(value);
        if (!scanner.consumeStringFast(quote)) {
            this.error('Missing end quote');
        }
        return value;
    }
    consumeWhitespace() {
        return Boolean(this.scanner.consumeMatchFn(syntax.isWhitespace));
    }
    consumeXmlDeclaration() {
        let { scanner  } = this;
        if (!scanner.consumeStringFast('<?xml')) {
            return false;
        }
        if (!this.consumeWhitespace()) {
            this.error('Invalid XML declaration');
        }
        let version = Boolean(scanner.consumeStringFast('version')) && this.consumeEqual() && this.consumeSystemLiteral();
        if (version === false) {
            this.error('XML version is missing or invalid');
        } else if (!/^1\.[0-9]+$/.test(version)) {
            this.error('Invalid character in version number');
        }
        if (this.consumeWhitespace()) {
            let encoding = Boolean(scanner.consumeStringFast('encoding')) && this.consumeEqual() && this.consumeSystemLiteral();
            if (encoding) {
                this.consumeWhitespace();
            }
            let standalone = Boolean(scanner.consumeStringFast('standalone')) && this.consumeEqual() && this.consumeSystemLiteral();
            if (standalone) {
                if (standalone !== 'yes' && standalone !== 'no') {
                    this.error('Only "yes" and "no" are permitted as values of `standalone`');
                }
                this.consumeWhitespace();
            }
        }
        if (!scanner.consumeStringFast('?>')) {
            this.error('Invalid or unclosed XML declaration');
        }
        return true;
    }
    error(message) {
        let { charIndex , string: xml  } = this.scanner;
        let column = 1;
        let excerpt = '';
        let line = 1;
        for(let i = 0; i < charIndex; ++i){
            let __char = xml[i];
            if (__char === '\n') {
                column = 1;
                excerpt = '';
                line += 1;
            } else {
                column += 1;
                excerpt += __char;
            }
        }
        let eol = xml.indexOf('\n', charIndex);
        excerpt += eol === -1 ? xml.slice(charIndex) : xml.slice(charIndex, eol);
        let excerptStart = 0;
        if (excerpt.length > 50) {
            if (column < 40) {
                excerpt = excerpt.slice(0, 50);
            } else {
                excerptStart = column - 20;
                excerpt = excerpt.slice(excerptStart, column + 30);
            }
        }
        let err = new Error(`${message} (line ${line}, column ${column})\n` + `  ${excerpt}\n` + ' '.repeat(column - excerptStart + 1) + '^\n');
        Object.assign(err, {
            column,
            excerpt,
            line,
            pos: charIndex
        });
        throw err;
    }
    validateChars(string) {
        let charIndex = 0;
        for (let __char of string){
            if (syntax.isNotXmlChar(__char)) {
                this.scanner.reset(-([
                    ...string
                ].length - charIndex));
                this.error('Invalid character');
            }
            charIndex += 1;
        }
    }
}
function normalizeXmlString(xml) {
    if (xml[0] === '\uFEFF') {
        xml = xml.slice(1);
    }
    return xml.replace(/\r\n?/g, '\n');
}
class XmlNamespaceStack {
    static forElement(element) {
        if (!(element instanceof XmlElement)) return null;
        let stack = new XmlNamespaceStack();
        do {
            stack.push(element);
            element = element.parent;
        }while (element instanceof XmlElement)
        const tmp = [];
        for (const e of stack.stack){
            tmp.unshift(e);
        }
        stack.stack = tmp;
        return stack;
    }
    constructor(){
        this.stack = [];
    }
    push(element) {
        const elementNamespaces = Object.create(null), attrNames = Object.keys(element.attributes);
        attrNames.filter((attrName)=>attrName.match(/^xmlns/)).forEach(function(attrName) {
            if (attrName.indexOf(':') !== -1) {
                elementNamespaces[attrName.split(':')[1]] = element.attributes[attrName];
            } else {
                elementNamespaces[''] = element.attributes[attrName];
            }
        });
        this.stack.unshift(elementNamespaces);
    }
    pop() {
        this.stack.shift();
    }
    get top() {
        return this.stack[0];
    }
    prefixFor(namespace, preferredPrefixes) {
        const isString = (e)=>typeof e === 'string', isArray = (e)=>e instanceof Array, prefixes = [];
        for (const nsItem of this.stack){
            if (!Object.values(nsItem).includes(namespace)) continue;
            Object.keys(nsItem).forEach(function(prefix) {
                if (nsItem[prefix] === namespace) prefixes.push(prefix);
            });
        }
        let prefix;
        prefixes.forEach(function(p) {
            if (!prefix || p.length < prefix.length) {
                prefix = p;
            }
        });
        if (isString(prefix)) return prefix;
        if (!isArray(preferredPrefixes)) return null;
        if (!isArray(preferredPrefixes) || preferredPrefixes.length === 0) {
            preferredPrefixes = [
                'ns'
            ];
        }
        let n = 0;
        do {
            for (const preferredPrefix of preferredPrefixes){
                let pref = preferredPrefix;
                if (!isString(pref) || !pref.match(/^[a-z]+$/)) {
                    pref = 'ns';
                }
                let p = `${pref}${n === 0 ? '' : n}`;
                let isNsTaken = false;
                for (const nsItem1 of this.stack){
                    if (!Object.keys(nsItem1).includes(p)) continue;
                    isNsTaken = true;
                    break;
                }
                if (!isNsTaken) {
                    prefix = p;
                    break;
                }
            }
            n++;
        }while (!prefix)
        return prefix;
    }
    findNamespace(currentElementName) {
        const isString = (e)=>typeof e === 'string', elementName = currentElementName.indexOf(':') === -1 ? `:${currentElementName}` : currentElementName, prefix = elementName.split(':')[0];
        let result = null;
        for (const nsItem of this.stack){
            const ns = nsItem[prefix];
            if (isString(ns)) {
                result = ns;
                break;
            }
        }
        return result;
    }
    makeCurrentElementSerializable(currentElement) {
        const elementNamespaces = Object.create(null);
        for(let i = this.stack.length - 1; i >= 0; i--){
            const namespaces = this.stack[i];
            for(const prefix in namespaces){
                if (Object.hasOwnProperty.call(namespaces, prefix)) {
                    const namespace = namespaces[prefix];
                    elementNamespaces[prefix] = namespace;
                }
            }
        }
        for(const prefix1 in elementNamespaces){
            if (Object.hasOwnProperty.call(elementNamespaces, prefix1)) {
                const namespace1 = elementNamespaces[prefix1], xmlnsAttrName = XmlNamespaceStack.nsAttrName(prefix1);
                currentElement.attributes[xmlnsAttrName] = namespace1;
            }
        }
    }
    toString() {
        return this.stack.map((item)=>Object.entries(item)).map((item)=>`[${item}]`).join(', ');
    }
    static verifyNamespace(namespace, element, nsStack) {
        nsStack.push(element);
        const ns = nsStack.findNamespace(element.name);
        if (ns !== namespace) return false;
        if (!Array.isArray(element.children)) return true;
        let childrenAreOk = true;
        for(let i = 0; i < element.children.length; i++){
            const child = element.children[i];
            if (!(child instanceof XmlElement)) continue;
            childrenAreOk = childrenAreOk && this.verifyNamespace(namespace, child, nsStack);
            if (!childrenAreOk) break;
        }
        nsStack.pop();
        return childrenAreOk;
    }
    static getElementNameWithoutPrefix(elementName) {
        return elementName.match(/:/) ? elementName.split(':')[1] : elementName;
    }
    static makeElementSerializable(element) {
        if (!(element instanceof XmlElement)) return;
        const nsStack = XmlNamespaceStack.forElement(element);
        nsStack.makeCurrentElementSerializable(element);
    }
    static nsAttrName(nsPrefix) {
        const isString = (e)=>typeof e === 'string';
        if (!isString(nsPrefix)) nsPrefix = '';
        return nsPrefix === '' ? 'xmlns' : `xmlns:${nsPrefix}`;
    }
    static elementName(unqualifiedName, nsPrefix) {
        const isString = (e)=>typeof e === 'string';
        if (!isString(unqualifiedName)) return null;
        if (!isString(nsPrefix)) nsPrefix = '';
        return nsPrefix === '' ? unqualifiedName : `${nsPrefix}:${unqualifiedName}`;
    }
    static encodeXmlTextString(text) {
        const itemIsString = (i)=>typeof i === 'string', encodings = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            "'": '&apos;',
            '"': '&quot;'
        };
        if (!itemIsString(text)) return null;
        let result = '';
        for(let i = 0; i < text.length; i++){
            const __char = text.charAt(i);
            result += encodings[__char] || __char;
        }
        return result;
    }
}
class Writer {
    static elementToString(element) {
        if (!(element instanceof XmlElement)) return '';
        const nsStack = new XmlNamespaceStack();
        let attributes = '', contents = '';
        for (const [k, v] of Object.entries(element.attributes)){
            attributes += ` ${k}="${this._encodeXmlTextString(v)}"`;
        }
        for (const n of element.children){
            if (n instanceof XmlText) {
                contents += this._encodeXmlTextString(n.text);
                continue;
            }
            if (!(n instanceof XmlElement)) continue;
            nsStack.push(n);
            contents += this.elementToString(n, nsStack);
            nsStack.pop();
        }
        return `<${element.name}${attributes}>${contents}</${element.name}>`;
    }
    static _encodeXmlTextString(text) {
        const itemIsString = (i)=>typeof i === 'string', encodings = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            "'": '&apos;',
            '"': '&quot;'
        };
        if (!itemIsString(text)) return null;
        let result = '';
        for(let i = 0; i < text.length; i++){
            const __char = text.charAt(i);
            result += encodings[__char] || __char;
        }
        return result;
    }
}
const mod = {
    Parser: Parser,
    Writer: Writer,
    Document: XmlDocument,
    Node: XmlNode,
    Element: XmlElement,
    Comment: XmlComment,
    Text: XmlText,
    Cdata: XmlCdata,
    ProcessingInstruction: XmlProcessingInstruction,
    NamespaceStack: XmlNamespaceStack
};
class Json extends GenericData {
    static tag = 'json';
    _value;
    static build(value) {
        return new Json(value);
    }
    constructor(value){
        super();
        const json = JSON.stringify(value);
        if (!json) throw new Error(`Value cannot be converted to JSON: ${value}`);
        this._value = value;
    }
    get value() {
        return this._value;
    }
    toString() {
        return `Json(${JSON.stringify(this.value)})`;
    }
    static fromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack || XmlNamespaceStack.forElement(element);
        let result = null, errorMessage = '';
        try {
            nsStack.push(element);
            const namespace = nsStack.findNamespace(element.name);
            if (!namespace) throw new Error(`namespace is not json's`);
            if (!(new URL(namespace).href === GenericData.namespace.href && XmlNamespaceStack.getElementNameWithoutPrefix(element.name) === Json.tag)) throw 'not an int';
            let text = '';
            for (const node of element.children){
                if (![
                    XmlNode.TYPE_TEXT,
                    XmlNode.TYPE_CDATA
                ].includes(node.type)) continue;
                text += node.text;
            }
            try {
                const value = JSON.parse(text);
                result = new Json(value);
            } catch (error) {
                throw new Error(`String is not valid JSON: "${text}"`);
            }
        } catch (error1) {
            errorMessage = `${error1}`;
        } finally{
            nsStack.pop();
        }
        if (result instanceof Json) {
            return result;
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        const namespace = GenericData.namespace.href, nsStack = namespaceStack || new XmlNamespaceStack(), existingPrefix = nsStack.prefixFor(namespace, null), useNewPrefix = typeof existingPrefix !== 'string', newPrefix = useNewPrefix ? nsStack.prefixFor(namespace, [
            'd'
        ]) : null, prefix = newPrefix || existingPrefix, attributes = Object.create(null), children = [
            new XmlText(JSON.stringify(this.value))
        ], name = XmlNamespaceStack.elementName(Json.tag, prefix), element = new XmlElement(name, attributes, children);
        if (useNewPrefix) {
            attributes[XmlNamespaceStack.nsAttrName(newPrefix)] = namespace;
        }
        return element;
    }
    static fromIndexedDb(encodedData) {
        if (!(encodedData && typeof encodedData === 'object' && !Array.isArray(encodedData) && encodedData.type === `${Json.namespace} ${Json.tag}`)) throw new Error('wrong IndexedDB object');
        return new Json(encodedData.value);
    }
    toIndexedDb() {
        return {
            type: `${Json.namespace} ${Json.tag}`,
            value: this.value
        };
    }
}
class SemanticData extends GenericData {
    static tag = 'semantic';
    static dataTypes = [
        'json-ld',
        'n-quads'
    ];
    _type;
    _value;
    static build(value, type) {
        return new SemanticData(value, type);
    }
    constructor(value, type){
        super();
        this._value = value;
        if (type == null || type == undefined || type.trim().length == 0) {
            type = SemanticData.dataTypes[0];
        }
        if (!SemanticData.dataTypes.includes(type)) throw new Error('Unknown semantic data type');
        this._type = type;
    }
    get type() {
        return this._type;
    }
    get value() {
        return this._value;
    }
    toString() {
        return `SemanticData(${this.value})`;
    }
    static fromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack || XmlNamespaceStack.forElement(element);
        let result = null, errorMessage = '';
        try {
            nsStack.push(element);
            const namespace = nsStack.findNamespace(element.name);
            if (!namespace) throw new Error(`data has no namespace`);
            if (!(new URL(namespace).href === GenericData.namespace.href)) throw 'bad data namespace';
            if (!(XmlNamespaceStack.getElementNameWithoutPrefix(element.name) === SemanticData.tag)) throw 'bad data element tag';
            let text = '';
            for (const node of element.children){
                if (![
                    XmlNode.TYPE_TEXT,
                    XmlNode.TYPE_CDATA
                ].includes(node.type)) continue;
                text += node.text;
            }
            const type = element.attributes['type'];
            let detectedType = SemanticData.dataTypes[0];
            if (type) {
                for (const dataType of SemanticData.dataTypes){
                    if (`${dataType}` === type) {
                        detectedType = dataType;
                        break;
                    }
                }
            }
            result = new SemanticData(text, detectedType);
        } catch (error) {
            errorMessage = `${error}`;
        } finally{
            nsStack.pop();
        }
        if (result instanceof SemanticData) {
            return result;
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        const namespace = GenericData.namespace.href, nsStack = namespaceStack || new XmlNamespaceStack(), existingPrefix = nsStack.prefixFor(namespace, null), useNewPrefix = typeof existingPrefix !== 'string', newPrefix = useNewPrefix ? nsStack.prefixFor(namespace, [
            'd'
        ]) : null, prefix = newPrefix || existingPrefix, attributes = Object.create(null), children = [
            new XmlText(JSON.stringify(this.value))
        ], name = XmlNamespaceStack.elementName(SemanticData.tag, prefix), element = new XmlElement(name, attributes, children);
        attributes['type'] = this.type;
        if (useNewPrefix) {
            attributes[XmlNamespaceStack.nsAttrName(newPrefix)] = namespace;
        }
        return element;
    }
    static fromIndexedDb(encodedData) {
        if (!(encodedData && typeof encodedData === 'object' && !Array.isArray(encodedData) && encodedData.type === `${SemanticData.namespace} ${SemanticData.tag}` && typeof encodedData.value === 'object' && typeof encodedData.value.type === 'string' && typeof encodedData.value.text === 'string')) throw new Error('wrong IndexedDB object');
        let detectedType = SemanticData.dataTypes[0];
        for (const dataType of SemanticData.dataTypes){
            if (`${dataType}` === encodedData.value.type) {
                detectedType = dataType;
                break;
            }
        }
        return new SemanticData(encodedData.value.text, detectedType);
    }
    toIndexedDb() {
        return {
            type: `${SemanticData.namespace} ${SemanticData.tag}`,
            value: {
                type: this.type,
                text: this.value
            }
        };
    }
}
DataValue.registry = [
    Json,
    SemanticData
];
class Instruction {
    static namespace = new URL('https://qworum.net/ns/v1/instruction/');
    static registry = [];
    toString() {
        throw new Error('not implemented');
    }
    static fromXmlElement(element, namespaceStack) {
        let errorMessage = 'Not valid instruction';
        for (const instructionType of this.registry){
            try {
                const instruction = instructionType.fromXmlElement(element, namespaceStack);
                return instruction;
            } catch (error) {}
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        throw new Error('not implemented');
    }
    static fromIndexedDb(encoded) {
        let errorMessage = 'Not valid instruction';
        for (const instructionType of this.registry){
            try {
                const instruction = instructionType.fromIndexedDb(encoded);
                return instruction;
            } catch (error) {}
        }
        throw new Error(errorMessage);
    }
    toIndexedDb() {
        throw new Error('not implemented');
    }
    static statementFromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack ? namespaceStack : XmlNamespaceStack.forElement(element);
        try {
            return this.fromXmlElement(element, nsStack);
        } catch (error) {}
        try {
            return DataValue.fromXmlElement(element, nsStack);
        } catch (error1) {}
        throw new Error('not a statement');
    }
    static statementFromIndexedDb(encodedStatement) {
        try {
            const instruction = this.fromIndexedDb(encodedStatement);
            return instruction;
        } catch (error) {}
        try {
            const o = DataValue.fromIndexedDb(encodedStatement);
            return o;
        } catch (error1) {}
        throw new Error('not a statement');
    }
}
class Fault extends Instruction {
    static tag = "fault";
    static serviceSpecificPrefix = '*';
    static serviceTypes = [
        'service',
        'script',
        'origin',
        'data',
        'path',
        'service-specific'
    ];
    static networkTypes = [
        'network'
    ];
    static userAgentTypes = [
        'user-agent',
        'runtime'
    ];
    static types = [
        this.serviceTypes,
        this.networkTypes,
        this.userAgentTypes
    ].flat();
    static defaultType = 'service';
    _type = Fault.defaultType;
    static build(type) {
        return new Fault(type);
    }
    constructor(type){
        super();
        if (!(typeof type === 'undefined' || Fault.types.includes(type) || type.startsWith(Fault.serviceSpecificPrefix))) throw new Error('not a fault');
        this._type = type || Fault.defaultType;
    }
    get type() {
        return this._type;
    }
    toString() {
        return `Fault(type: ${this.type})`;
    }
    matches(types) {
        let faultTypes = [];
        if (types) {
            if (typeof types === 'string') {
                faultTypes = [
                    types
                ];
            } else {
                faultTypes = types;
            }
        }
        if (faultTypes.length === 0) return true;
        if (faultTypes.includes(this.type)) return true;
        if (Fault.serviceTypes.includes(this.type) && faultTypes.includes(Fault.serviceTypes[0])) return true;
        if (Fault.networkTypes.includes(this.type) && faultTypes.includes(Fault.networkTypes[0])) return true;
        if (Fault.userAgentTypes.includes(this.type) && faultTypes.includes(Fault.userAgentTypes[0])) return true;
        if (this.type.startsWith(Fault.serviceSpecificPrefix) && faultTypes.includes('service-specific')) return true;
        return false;
    }
    static fromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack ? namespaceStack : XmlNamespaceStack.forElement(element);
        let type = element.attributes.type || Fault.defaultType, result = null, errorMessage = '';
        try {
            nsStack.push(element);
            const namespace = nsStack.findNamespace(element.name), tag = XmlNamespaceStack.getElementNameWithoutPrefix(element.name);
            if (!namespace) throw new Error(`namespace is not json's`);
            if (!(new URL(namespace).href === Fault.namespace.href && tag === this.tag)) throw `not a ${this.tag}`;
            const type1 = element.attributes.type || Fault.defaultType;
            result = new Fault(type1);
        } catch (error) {
            errorMessage = `${error}`;
        } finally{
            nsStack.pop();
        }
        if (result instanceof Fault) {
            return result;
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        const namespace = Instruction.namespace.href, nsStack = namespaceStack || new XmlNamespaceStack(), existingPrefix = nsStack.prefixFor(namespace, null), useNewPrefix = typeof existingPrefix !== 'string', newPrefix = useNewPrefix ? nsStack.prefixFor(namespace, [
            'q'
        ]) : null, prefix = newPrefix || existingPrefix, attributes = Object.create(null), children = [], name = XmlNamespaceStack.elementName(Fault.tag, prefix), element = new XmlElement(name, attributes, children);
        attributes['type'] = this.type;
        if (useNewPrefix) {
            attributes[XmlNamespaceStack.nsAttrName(newPrefix)] = namespace;
        }
        return element;
    }
    static fromIndexedDb(encoded) {
        if (encoded.type !== Fault.tag) throw new Error(`not a ${this.tag}`);
        return new Fault(encoded.value?.type || Fault.defaultType);
    }
    toIndexedDb() {
        return {
            type: Fault.tag,
            value: {
                type: this.type
            }
        };
    }
}
class Return extends Instruction {
    static tag = "return";
    statement;
    static build(statement) {
        return new Return(statement);
    }
    constructor(statement){
        super();
        if (!statement) throw new Error('statement required');
        this.statement = statement;
    }
    toString() {
        return `Return(${this.statement})`;
    }
    static fromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack ? namespaceStack : mod.NamespaceStack.forElement(element);
        let result = null, errorMessage = '';
        try {
            nsStack.push(element);
            const namespace = nsStack.findNamespace(element.name), tag = mod.NamespaceStack.getElementNameWithoutPrefix(element.name);
            if (!namespace) throw new Error(`not a namespace`);
            if (!(new URL(namespace).href === Return.namespace.href && tag === this.tag)) throw `not a ${this.tag}`;
            let statement = null;
            for (const statementElement of element.children){
                if (!(statementElement.type === mod.Node.TYPE_ELEMENT)) continue;
                statement = Instruction.statementFromXmlElement(statementElement, nsStack);
                break;
            }
            if (statement !== null) {
                result = new Return(statement);
            }
        } catch (error) {
            errorMessage = `${error}`;
        } finally{
            nsStack.pop();
        }
        if (result instanceof Return) {
            return result;
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        const namespace = Instruction.namespace.href, nsStack = namespaceStack || new mod.NamespaceStack(), existingPrefix = nsStack.prefixFor(namespace, null), useNewPrefix = typeof existingPrefix !== 'string', newPrefix = useNewPrefix ? nsStack.prefixFor(namespace, [
            'q'
        ]) : null, prefix = newPrefix || existingPrefix, attributes = Object.create(null), children = [], name = mod.NamespaceStack.elementName(Return.tag, prefix), element = new mod.Element(name, attributes, children);
        if (useNewPrefix) {
            attributes[mod.NamespaceStack.nsAttrName(newPrefix)] = namespace;
        }
        nsStack.push(element);
        children.push(this.statement.toXmlElement(nsStack));
        nsStack.pop();
        return element;
    }
    static fromIndexedDb(encoded) {
        if (encoded.type !== this.tag) throw new Error(`not a ${this.tag}`);
        return new Return(Instruction.statementFromIndexedDb(encoded.value.statement));
    }
    toIndexedDb() {
        return {
            type: Return.tag,
            value: {
                statement: this.statement.toIndexedDb()
            }
        };
    }
}
class Sequence extends Instruction {
    static tag = "sequence";
    _statements;
    static build(...statements) {
        return new Sequence(...statements);
    }
    constructor(...statements){
        super();
        if (!statements) throw new Error('sequence must contain one or more statements');
        let s = [];
        if (statements instanceof Array) {
            s = statements;
        } else {
            s = [
                statements
            ];
        }
        if (s.length === 0) throw new Error('sequence must contain one or more statements');
        this._statements = s;
    }
    get statements() {
        return this._statements;
    }
    toString() {
        return `Sequence(${this.statements})`;
    }
    static fromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack ? namespaceStack : XmlNamespaceStack.forElement(element);
        let result = null, errorMessage = '';
        try {
            nsStack.push(element);
            const namespace = nsStack.findNamespace(element.name), tag = XmlNamespaceStack.getElementNameWithoutPrefix(element.name);
            if (!namespace) throw new Error(`not a namespace`);
            if (!(new URL(namespace).href === Sequence.namespace.href && tag === this.tag)) throw `not a ${this.tag}`;
            const statements = [];
            for (const statementElement of element.children){
                if (!(statementElement.type === XmlNode.TYPE_ELEMENT)) continue;
                statements.push(Instruction.statementFromXmlElement(statementElement, nsStack));
            }
            if (statements.length > 0) {
                result = new Sequence(...statements);
            }
        } catch (error) {
            errorMessage = `${error}`;
        } finally{
            nsStack.pop();
        }
        if (result instanceof Sequence) {
            return result;
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        const namespace = Instruction.namespace.href, nsStack = namespaceStack || new XmlNamespaceStack(), existingPrefix = nsStack.prefixFor(namespace, null), useNewPrefix = typeof existingPrefix !== 'string', newPrefix = useNewPrefix ? nsStack.prefixFor(namespace, [
            'q'
        ]) : null, prefix = newPrefix || existingPrefix, attributes = Object.create(null), children = [], name = XmlNamespaceStack.elementName(Sequence.tag, prefix), element = new XmlElement(name, attributes, children);
        if (useNewPrefix) {
            attributes[XmlNamespaceStack.nsAttrName(newPrefix)] = namespace;
        }
        nsStack.push(element);
        for (const statement of this.statements){
            children.push(statement.toXmlElement(nsStack));
        }
        nsStack.pop();
        return element;
    }
    static fromIndexedDb(encoded) {
        if (encoded.type !== this.tag) throw new Error(`not a ${this.tag}`);
        const statements = encoded.value.statements.map((encodedStatement)=>Instruction.statementFromIndexedDb(encodedStatement));
        return new Sequence(...statements);
    }
    toIndexedDb() {
        return {
            type: Sequence.tag,
            value: {
                statements: this.statements.map((statement)=>statement.toIndexedDb())
            }
        };
    }
}
class Data extends Instruction {
    static tag = "data";
    _path = [];
    statement = null;
    static build(path, statement) {
        return new Data(path, statement);
    }
    constructor(path, statement){
        super();
        const p = path instanceof Array ? path : [
            path
        ];
        if (p.length === 0) throw new Error('path must have at least one element');
        for(let i = 0; i < p.length; i++){
            const e = p[i];
            if (!(typeof e === "string")) throw new Error('path element must be a string');
            p[i] = e.trim();
        }
        this._path = p;
        this.statement = statement || null;
    }
    get path() {
        return this._path;
    }
    toString() {
        return `Data(path: [${this.path.join(', ')}], statement: ${this.statement})`;
    }
    static fromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack ? namespaceStack : XmlNamespaceStack.forElement(element);
        let result = null, errorMessage = '';
        try {
            nsStack.push(element);
            const namespace = nsStack.findNamespace(element.name), tag = XmlNamespaceStack.getElementNameWithoutPrefix(element.name);
            if (!namespace) throw new Error(`not a namespace`);
            if (!(new URL(namespace).href === Data.namespace.href && tag === this.tag)) throw `not a ${this.tag}`;
            const maybePath = element.attributes.path;
            if (typeof maybePath !== 'string') throw new Error(`${this.tag} must have a path`);
            let path = [];
            try {
                path = JSON.parse(maybePath);
                if (!(path instanceof Array && path.length > 0)) throw new Error('invalid data path');
                for(let i = 0; i < path.length; i++){
                    const pathElement = path[i];
                    if (!(typeof pathElement === "string")) {
                        throw new Error('invalid path element');
                    }
                }
            } catch (error) {
                throw new Error(`Not a valid data path: "${maybePath}"`);
            }
            let statement = null;
            for (const statementElement of element.children){
                if (!(statementElement.type === XmlNode.TYPE_ELEMENT)) continue;
                statement = Instruction.statementFromXmlElement(statementElement, nsStack);
                break;
            }
            if (statement === null) {
                result = new Data(path);
            } else {
                result = new Data(path, statement);
            }
        } catch (error1) {
            errorMessage = `${error1}`;
        } finally{
            nsStack.pop();
        }
        if (result instanceof Data) {
            return result;
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        const namespace = Instruction.namespace.href, nsStack = namespaceStack || new XmlNamespaceStack(), existingPrefix = nsStack.prefixFor(namespace, null), useNewPrefix = typeof existingPrefix !== 'string', newPrefix = useNewPrefix ? nsStack.prefixFor(namespace, [
            'q'
        ]) : null, prefix = newPrefix || existingPrefix, attributes = Object.create(null), children = [], name = XmlNamespaceStack.elementName(Data.tag, prefix), element = new XmlElement(name, attributes, children);
        attributes.path = JSON.stringify(this.path);
        if (useNewPrefix) {
            attributes[XmlNamespaceStack.nsAttrName(newPrefix)] = namespace;
        }
        if (this.statement) {
            nsStack.push(element);
            children.push(this.statement.toXmlElement(nsStack));
            nsStack.pop();
        }
        return element;
    }
    static fromIndexedDb(encoded) {
        if (encoded.type !== Data.tag) throw new Error(`not a ${this.tag}`);
        if (encoded.value) {
            if (encoded.value.statement) {
                return new Data(encoded.value.path, Instruction.statementFromIndexedDb(encoded.value.statement));
            }
        }
        return new Data(encoded.value.path);
    }
    toIndexedDb() {
        return {
            type: Data.tag,
            value: {
                path: this.path,
                statement: this.statement ? this.statement.toIndexedDb() : null
            }
        };
    }
}
class Try extends Instruction {
    static tag = "try";
    statement;
    _catchClauses;
    static build(statement, catchClauses) {
        return new Try(statement, catchClauses);
    }
    constructor(statement, catchClauses){
        super();
        if (!statement) throw new Error('try must contain one statement');
        let s;
        if (statement instanceof Array) {
            s = new Sequence(...statement);
        } else {
            s = statement;
        }
        this.statement = s;
        const c = [];
        if (!(catchClauses instanceof Array)) catchClauses = [
            catchClauses
        ];
        for (const catchClauseArg of catchClauses){
            const catchClause = Object.create(null);
            catchClause['catch'] = [];
            catchClause['do'] = [];
            if (typeof catchClauseArg['catch'] === 'string') {
                catchClause['catch'] = [
                    catchClauseArg['catch']
                ];
            } else if (catchClauseArg['catch'] instanceof Array) {
                catchClause['catch'] = catchClauseArg['catch'];
            }
            for (const faultType of catchClause['catch'])try {
                new Fault(faultType);
            } catch (error) {
                throw new Error(`Error for fault type "${faultType}": ${error}`);
            }
            if (catchClauseArg['do']) {
                catchClause['do'] = catchClauseArg['do'];
                if (!(catchClauseArg['do'] instanceof Array)) {
                    catchClause['do'] = [
                        catchClauseArg['do']
                    ];
                }
            }
            if (catchClause['do'].length === 0) throw new Error('catch clause must have at least one statement');
            c.push(catchClause);
        }
        if (c.length === 0) throw new Error('try must contain at least one catch clause');
        this._catchClauses = c;
    }
    get catchClauses() {
        return this._catchClauses;
    }
    toString() {
        let catchClauses = '';
        for (const catchClause of this.catchClauses){
            if (catchClauses.length > 0) catchClauses += ', ';
            catchClauses += `{catch: "${catchClause.catch.join(', ')}", do: [`;
            catchClauses += catchClause.do.map((instruction)=>`${instruction}`).join(', ');
            catchClauses += `]`;
            catchClauses += '}';
        }
        catchClauses = `[${catchClauses}]`;
        this.catchClauses.map((cc)=>({
                catch: cc.catch.length > 0 ? cc.catch.join(', ') : [],
                do: [
                    cc.do.map((d)=>d.toString()).join(', ')
                ]
            }));
        return `Try(${this.statement}, ${catchClauses})`;
    }
    static fromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack ? namespaceStack : XmlNamespaceStack.forElement(element);
        let result = null, errorMessage = '';
        try {
            nsStack.push(element);
            const namespace = nsStack.findNamespace(element.name), tag = XmlNamespaceStack.getElementNameWithoutPrefix(element.name);
            if (!namespace) throw new Error(`not a namespace`);
            if (!(new URL(namespace).href === Try.namespace.href && tag === this.tag)) throw `not a ${this.tag}`;
            let statement = null, catchClauses = [];
            for (const e of element.children){
                if (!(e.type === XmlNode.TYPE_ELEMENT)) continue;
                if (!statement) {
                    statement = Instruction.statementFromXmlElement(e, nsStack);
                    continue;
                }
                try {
                    nsStack.push(e);
                    const catchNamespace = nsStack.findNamespace(e.name), tag1 = XmlNamespaceStack.getElementNameWithoutPrefix(e.name);
                    if (!catchNamespace) throw new Error(`element without namespace`);
                    if (!(new URL(catchNamespace).href === Try.namespace.href && tag1 === 'catch')) throw `not a catch clause`;
                    let faultsToCatch = [], catchStatements = [];
                    if (typeof e.attributes.faults === 'string') {
                        faultsToCatch = JSON.parse(e.attributes.faults).map((s)=>s.trim());
                        for (const faultType of faultsToCatch)try {
                            new Fault(faultType);
                        } catch (error) {
                            throw new Error(`Error for fault type "${faultType}": ${error}`);
                        }
                    }
                    for (const catchStatementElement of e.children){
                        if (!(catchStatementElement.type === XmlNode.TYPE_ELEMENT)) continue;
                        const catchStatement = Instruction.statementFromXmlElement(catchStatementElement, nsStack);
                        catchStatements.push(catchStatement);
                    }
                    if (catchStatements.length === 0) throw new Error(`catch clause has no statement`);
                    catchClauses.push({
                        catch: faultsToCatch,
                        do: catchStatements
                    });
                } catch (error1) {
                    errorMessage = `${error1}`;
                } finally{
                    nsStack.pop();
                }
            }
            if (!statement) throw new Error(`try has no statement`);
            if (catchClauses.length === 0) throw new Error(`try has no catch clause`);
            result = new Try(statement, catchClauses);
        } catch (error2) {
            errorMessage = `${error2}`;
        } finally{
            nsStack.pop();
        }
        if (result instanceof Try) {
            return result;
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        const namespace = Instruction.namespace.href, nsStack = namespaceStack || new XmlNamespaceStack(), existingPrefix = nsStack.prefixFor(namespace, null), useNewPrefix = typeof existingPrefix !== 'string', newPrefix = useNewPrefix ? nsStack.prefixFor(namespace, [
            'q'
        ]) : null, prefix = newPrefix || existingPrefix, attributes = Object.create(null), children = [], name = XmlNamespaceStack.elementName(Try.tag, prefix), element = new XmlElement(name, attributes, children);
        if (useNewPrefix) {
            attributes[XmlNamespaceStack.nsAttrName(newPrefix)] = namespace;
        }
        nsStack.push(element);
        children.push(this.statement.toXmlElement(nsStack));
        for (const catchClause of this.catchClauses){
            const catchElement = new XmlElement(XmlNamespaceStack.elementName('catch', prefix), catchClause['catch'].length > 0 ? {
                faults: JSON.stringify(catchClause['catch'])
            } : {}, catchClause['do'].map((instruction)=>instruction.toXmlElement(nsStack)));
            children.push(catchElement);
        }
        nsStack.pop();
        return element;
    }
    static fromIndexedDb(encoded) {
        if (encoded.type !== this.tag) throw new Error(`not a ${this.tag}`);
        const statement = Instruction.statementFromIndexedDb(encoded.value.statement), catchClauses = encoded.value.catch.map((c)=>({
                'catch': c.catch,
                'do': c.do.map((encodedStatement)=>Instruction.statementFromIndexedDb(encodedStatement))
            }));
        return new Try(statement, catchClauses);
    }
    toIndexedDb() {
        return {
            type: Try.tag,
            value: {
                statement: this.statement.toIndexedDb(),
                catch: this.catchClauses.map((c)=>({
                        'catch': c.catch,
                        'do': c.do.map((statement)=>statement.toIndexedDb())
                    }))
            }
        };
    }
}
class Goto extends Instruction {
    static tag = "goto";
    _href = null;
    _parameters = [];
    static build(href) {
        return new Goto(href);
    }
    constructor(href){
        super();
        const parameters = [];
        if (typeof href === 'string') this._href = href;
        if (!parameters) return;
        const params = parameters instanceof Array ? parameters : [
            parameters
        ];
        for (const value of params.values()){
            this._parameters.push(value);
        }
    }
    get href() {
        return this._href;
    }
    get parameters() {
        return this._parameters;
    }
    parameter(name) {
        const param = this._parameters.find((p)=>p.name === name);
        if (typeof param === 'undefined') throw new Error(`parameter "${name}" not found`);
        return param.value;
    }
    toString() {
        let parameters = null, result = '';
        for (const param of this.parameters){
            if (parameters === null) {
                parameters = '';
            } else {
                parameters += ', ';
            }
            parameters += `{name: ${param.name}, value: ${param.value}}`;
        }
        if (typeof this.href === 'string') {
            result += `href: ${this.href}`;
        }
        if (typeof parameters === 'string') {
            if (result.length > 0) result += ', ';
            result += `parameters: [${parameters}]`;
        }
        return `Goto(${result})`;
    }
    static fromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack ? namespaceStack : XmlNamespaceStack.forElement(element);
        let result = null, errorMessage = '';
        try {
            nsStack.push(element);
            const namespace = nsStack.findNamespace(element.name), tag = XmlNamespaceStack.getElementNameWithoutPrefix(element.name);
            if (!namespace) throw new Error(`not a namespace`);
            if (!(new URL(namespace).href === Goto.namespace.href && tag === this.tag)) throw `not a ${this.tag}`;
            let href = null, parameters = [];
            if (typeof element.attributes.href === 'string') href = element.attributes.href;
            for (const parametersElement of element.children){
                if (parametersElement.type !== XmlNode.TYPE_ELEMENT) continue;
                try {
                    nsStack.push(parametersElement);
                    const parametersNamespace = nsStack.findNamespace(parametersElement.name), parametersTag = XmlNamespaceStack.getElementNameWithoutPrefix(parametersElement.name);
                    if (!parametersNamespace) throw new Error(`not a namespace`);
                    if (!(new URL(parametersNamespace).href === Goto.namespace.href && parametersTag === 'data-args')) throw `not a parameters`;
                    for (const parameterElement of parametersElement.children){
                        if (parameterElement.type !== XmlNode.TYPE_ELEMENT) continue;
                        try {
                            nsStack.push(parameterElement);
                            const parameterNamespace = nsStack.findNamespace(parameterElement.name), parameterTag = XmlNamespaceStack.getElementNameWithoutPrefix(parameterElement.name);
                            if (!parameterNamespace) throw new Error(`not a namespace`);
                            if (!(new URL(parameterNamespace).href === Goto.namespace.href && parameterTag === 'data-arg')) throw `not a parameter`;
                            if (!(typeof parameterElement.attributes.name === 'string')) throw new Error('parameter without name');
                            const parameterName = parameterElement.attributes.name;
                            for (const parameterValueElement of parameterElement.children){
                                if (parameterValueElement.type !== XmlNode.TYPE_ELEMENT) continue;
                                parameters.push({
                                    name: parameterName,
                                    value: Instruction.statementFromXmlElement(parameterValueElement, nsStack)
                                });
                            }
                        } catch (error) {
                            errorMessage = `${error}`;
                        } finally{
                            nsStack.pop();
                        }
                    }
                } catch (error1) {
                    errorMessage = `${error1}`;
                } finally{
                    nsStack.pop();
                }
            }
            result = new Goto(href);
        } catch (error2) {
            errorMessage = `${error2}`;
        } finally{
            nsStack.pop();
        }
        if (result instanceof Goto) {
            return result;
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        const namespace = Instruction.namespace.href, nsStack = namespaceStack || new XmlNamespaceStack(), existingPrefix = nsStack.prefixFor(namespace, null), useNewPrefix = typeof existingPrefix !== 'string', newPrefix = useNewPrefix ? nsStack.prefixFor(namespace, [
            'q'
        ]) : null, prefix = newPrefix || existingPrefix, attributes = Object.create(null), children = [], name = XmlNamespaceStack.elementName(Goto.tag, prefix), element = new XmlElement(name, attributes, children);
        if (useNewPrefix) {
            attributes[XmlNamespaceStack.nsAttrName(newPrefix)] = namespace;
        }
        if (typeof this.href === 'string') attributes['href'] = this.href;
        if (this.parameters.length > 0) {
            nsStack.push(element);
            const parametersAttributes = Object.create(null), parametersChildren = [], parametersElement = new XmlElement(XmlNamespaceStack.elementName('data-args', prefix), parametersAttributes, parametersChildren);
            element.children.push(parametersElement);
            for (const parameter of this.parameters){
                const parameterAttributes = Object.create(null), parameterChildren = [], parameterElement = new XmlElement(XmlNamespaceStack.elementName('data-arg', prefix), parameterAttributes, parameterChildren);
                parameterAttributes['name'] = parameter.name;
                parameterChildren.push(parameter.value.toXmlElement(nsStack));
                parametersChildren.push(parameterElement);
            }
            nsStack.pop();
        }
        return element;
    }
    static fromIndexedDb(encoded) {
        if (encoded.type !== this.tag) throw new Error(`not a ${this.tag}`);
        return new Goto(encoded.value.href);
    }
    toIndexedDb() {
        return {
            type: Goto.tag,
            value: {
                href: this.href,
                parameters: this.parameters.map((param)=>({
                        name: param.name,
                        value: param.value.toIndexedDb()
                    }))
            }
        };
    }
}
class Call extends Instruction {
    static tag = "call";
    _object = [];
    _href = null;
    _parameters = [];
    _objectParameters = [];
    _sendParameters = false;
    static build(object, href, parameters, objectParameters) {
        return new Call(object, href, parameters, objectParameters);
    }
    constructor(object, href, parameters, objectParameters){
        super();
        const sendParameters = false;
        const o = object === null || typeof object === 'undefined' ? [
            '@'
        ] : object instanceof Array ? object : [
            object
        ];
        if (o.length === 0) o.push('@');
        for(let i = 0; i < o.length; i++){
            const e = o[i];
            if (!(typeof e === "string")) throw new Error('object path element must be a string');
            o[i] = e.trim();
        }
        this._object = o;
        if (typeof href === 'string') this._href = href;
        if (objectParameters) {
            const objectParams = objectParameters instanceof Array ? objectParameters : [
                objectParameters
            ];
            for (const value of objectParams.values()){
                this._objectParameters.push(value);
            }
        }
        if (parameters) {
            const params = parameters instanceof Array ? parameters : [
                parameters
            ];
            for (const value1 of params.values()){
                this._parameters.push(value1);
            }
        }
        if (!(false === null || typeof false === 'undefined')) {
            this._sendParameters = sendParameters;
        }
    }
    get object() {
        return this._object;
    }
    get href() {
        return this._href;
    }
    get objectParameters() {
        return this._objectParameters;
    }
    get parameters() {
        return this._parameters;
    }
    get sendParameters() {
        return this._sendParameters;
    }
    objectParameter(name) {
        const objectParam = this._objectParameters.find((p)=>p.name === name);
        if (typeof objectParam === 'undefined') throw new Error(`object parameter "${name}" not found`);
        return objectParam.object;
    }
    parameter(name) {
        const param = this._parameters.find((p)=>p.name === name);
        if (typeof param === 'undefined') throw new Error(`parameter "${name}" not found`);
        return param.value;
    }
    toString() {
        let objectParameters = null, parameters = null, result = '';
        for (const objectParam of this.objectParameters){
            if (objectParameters === null) {
                objectParameters = '';
            } else {
                objectParameters += ', ';
            }
            objectParameters += `{name: ${objectParam.name}, object: ${JSON.stringify(objectParam.object)}}`;
        }
        for (const param of this.parameters){
            if (parameters === null) {
                parameters = '';
            } else {
                parameters += ', ';
            }
            parameters += `{name: ${param.name}, value: ${param.value}}`;
        }
        if (typeof this.href === 'string') {
            result += `href: ${this.href}`;
        }
        if (typeof objectParameters === 'string') {
            if (result.length > 0) result += ', ';
            result += `objectParameters: [${objectParameters}]`;
        }
        if (typeof parameters === 'string') {
            if (result.length > 0) result += ', ';
            result += `parameters: [${parameters}]`;
        }
        return `Call(object: [${this.object.join(', ')}], ${result})`;
    }
    static fromXmlElement(element, namespaceStack) {
        const nsStack = namespaceStack ? namespaceStack : XmlNamespaceStack.forElement(element);
        let result = null, errorMessage = '';
        try {
            nsStack.push(element);
            const namespace = nsStack.findNamespace(element.name), tag = XmlNamespaceStack.getElementNameWithoutPrefix(element.name);
            if (!namespace) throw new Error(`not a namespace`);
            if (!(new URL(namespace).href === Call.namespace.href && tag === this.tag)) throw `not a ${this.tag}`;
            const maybeObject = element.attributes.object;
            if (typeof maybeObject !== 'string') throw new Error(`${this.tag} must have a path`);
            let object = [];
            try {
                object = JSON.parse(maybeObject);
                if (!(object instanceof Array && object.length > 0)) throw new Error('invalid object path');
                for(let i = 0; i < object.length; i++){
                    const pathElement = object[i];
                    if (!(typeof pathElement === "string")) {
                        throw new Error('invalid path element');
                    }
                }
            } catch (error) {
                throw new Error(`Not a valid object path: "${maybeObject}"`);
            }
            let href = null, objectParameters = [], parameters = [], sendParameters = false;
            if (typeof element.attributes.href === 'string') href = element.attributes.href;
            for (const objectParametersElement of element.children){
                if (objectParametersElement.type !== XmlNode.TYPE_ELEMENT) continue;
                try {
                    nsStack.push(objectParametersElement);
                    const objectParametersNamespace = nsStack.findNamespace(objectParametersElement.name), objectParametersTag = XmlNamespaceStack.getElementNameWithoutPrefix(objectParametersElement.name);
                    if (!objectParametersNamespace) throw new Error(`not a namespace`);
                    if (!(new URL(objectParametersNamespace).href === Call.namespace.href && objectParametersTag === 'object-args')) throw `not an object parameters element`;
                    for (const objectParameterElement of objectParametersElement.children){
                        if (objectParameterElement.type !== XmlNode.TYPE_ELEMENT) continue;
                        try {
                            nsStack.push(objectParameterElement);
                            const objectParameterNamespace = nsStack.findNamespace(objectParameterElement.name), objectParameterTag = XmlNamespaceStack.getElementNameWithoutPrefix(objectParameterElement.name);
                            if (!objectParameterNamespace) throw new Error(`not a namespace`);
                            if (!(new URL(objectParameterNamespace).href === Call.namespace.href && objectParameterTag === 'object-arg')) throw `not an object parameter`;
                            if (!(typeof objectParameterElement.attributes.name === 'string')) throw new Error('object parameter without name');
                            const objectParameterName = objectParameterElement.attributes.name, objectParameterObject = objectParameterElement.attributes.object;
                            objectParameters.push({
                                name: objectParameterName,
                                object: JSON.parse(objectParameterObject)
                            });
                        } catch (error1) {
                            errorMessage = `${error1}`;
                        } finally{
                            nsStack.pop();
                        }
                    }
                } catch (error2) {
                    errorMessage = `${error2}`;
                } finally{
                    nsStack.pop();
                }
            }
            for (const parametersElement of element.children){
                if (parametersElement.type !== XmlNode.TYPE_ELEMENT) continue;
                try {
                    nsStack.push(parametersElement);
                    const parametersNamespace = nsStack.findNamespace(parametersElement.name), parametersTag = XmlNamespaceStack.getElementNameWithoutPrefix(parametersElement.name);
                    if (!parametersNamespace) throw new Error(`not a namespace`);
                    if (!(new URL(parametersNamespace).href === Call.namespace.href && parametersTag === 'data-args')) throw `not a parameters element`;
                    sendParameters = parametersElement.attributes.name === 'true';
                    for (const parameterElement of parametersElement.children){
                        if (parameterElement.type !== XmlNode.TYPE_ELEMENT) continue;
                        try {
                            nsStack.push(parameterElement);
                            const parameterNamespace = nsStack.findNamespace(parameterElement.name), parameterTag = XmlNamespaceStack.getElementNameWithoutPrefix(parameterElement.name);
                            if (!parameterNamespace) throw new Error(`not a namespace`);
                            if (!(new URL(parameterNamespace).href === Call.namespace.href && parameterTag === 'data-arg')) throw `not a parameter`;
                            if (!(typeof parameterElement.attributes.name === 'string')) throw new Error('parameter without name');
                            const parameterName = parameterElement.attributes.name;
                            for (const parameterValueElement of parameterElement.children){
                                if (parameterValueElement.type !== XmlNode.TYPE_ELEMENT) continue;
                                parameters.push({
                                    name: parameterName,
                                    value: Instruction.statementFromXmlElement(parameterValueElement, nsStack)
                                });
                            }
                        } catch (error3) {
                            errorMessage = `${error3}`;
                        } finally{
                            nsStack.pop();
                        }
                    }
                } catch (error4) {
                    errorMessage = `${error4}`;
                } finally{
                    nsStack.pop();
                }
            }
            result = new Call(object, href, parameters, objectParameters);
        } catch (error5) {
            errorMessage = `${error5}`;
        } finally{
            nsStack.pop();
        }
        if (result instanceof Call) {
            return result;
        }
        throw new Error(errorMessage);
    }
    toXmlElement(namespaceStack) {
        const namespace = Instruction.namespace.href, nsStack = namespaceStack || new XmlNamespaceStack(), existingPrefix = nsStack.prefixFor(namespace, null), useNewPrefix = typeof existingPrefix !== 'string', newPrefix = useNewPrefix ? nsStack.prefixFor(namespace, [
            'q'
        ]) : null, prefix = newPrefix || existingPrefix, attributes = Object.create(null), children = [], name = XmlNamespaceStack.elementName(Call.tag, prefix), element = new XmlElement(name, attributes, children);
        if (useNewPrefix) {
            attributes[XmlNamespaceStack.nsAttrName(newPrefix)] = namespace;
        }
        attributes['object'] = JSON.stringify(this.object);
        if (typeof this.href === 'string') attributes['href'] = this.href;
        if (this.objectParameters.length > 0) {
            nsStack.push(element);
            const objectParametersAttributes = Object.create(null), objectParametersChildren = [], objectParametersElement = new XmlElement(XmlNamespaceStack.elementName('object-args', prefix), objectParametersAttributes, objectParametersChildren);
            element.children.push(objectParametersElement);
            for (const objectParameter of this.objectParameters){
                const objectParameterAttributes = Object.create(null), objectParameterChildren = [], objectParameterElement = new XmlElement(XmlNamespaceStack.elementName('object-arg', prefix), objectParameterAttributes, objectParameterChildren);
                objectParameterAttributes['name'] = objectParameter.name;
                objectParameterAttributes['object'] = JSON.stringify(objectParameter.object);
                objectParametersChildren.push(objectParameterElement);
            }
            nsStack.pop();
        }
        if (this.parameters.length > 0) {
            nsStack.push(element);
            const parametersAttributes = Object.create(null), parametersChildren = [], parametersElement = new XmlElement(XmlNamespaceStack.elementName('data-args', prefix), parametersAttributes, parametersChildren);
            if (this.sendParameters) parametersAttributes['send'] = `${this.sendParameters}`;
            element.children.push(parametersElement);
            for (const parameter of this.parameters){
                const parameterAttributes = Object.create(null), parameterChildren = [], parameterElement = new XmlElement(XmlNamespaceStack.elementName('data-arg', prefix), parameterAttributes, parameterChildren);
                parameterAttributes['name'] = parameter.name;
                parameterChildren.push(parameter.value.toXmlElement(nsStack));
                parametersChildren.push(parameterElement);
            }
            nsStack.pop();
        }
        return element;
    }
    static fromIndexedDb(encoded) {
        if (encoded.type !== this.tag) throw new Error(`not a ${this.tag}`);
        return new Call(encoded.value.object, encoded.value.href, encoded.value.parameters.map((parameter)=>({
                name: parameter.name,
                value: Instruction.statementFromIndexedDb(parameter.value)
            })), encoded.value.objectParameters);
    }
    toIndexedDb() {
        return {
            type: Call.tag,
            value: {
                object: this.object,
                href: this.href,
                parameters: this.parameters.map((param)=>({
                        name: param.name,
                        value: param.value.toIndexedDb()
                    })),
                sendParameters: this.sendParameters,
                objectParameters: this.objectParameters
            }
        };
    }
}
Instruction.registry = [
    Fault,
    Return,
    Sequence,
    Data,
    Try,
    Goto,
    Call, 
];
class Script {
    static contentType = 'application/xml';
    _instruction;
    static build(instruction) {
        return new Script(instruction);
    }
    constructor(instruction){
        if (!(instruction instanceof Instruction)) throw new Error('one or more parameters required');
        this._instruction = instruction;
    }
    get instruction() {
        return this._instruction;
    }
    toString() {
        return `${this.instruction}`;
    }
    static fromXml(xmlStr) {
        const doc = new Parser(xmlStr).document, instruction = Instruction.fromXmlElement(doc.root);
        return new Script(instruction);
    }
    toXml() {
        return Writer.elementToString(this.instruction.toXmlElement());
    }
}
class PhaseParameters {
    static namespace = new URL('https://qworum.net/ns/v1/phase-parameters/');
    _params = [];
    static build(params) {
        return new PhaseParameters(params);
    }
    constructor(params){
        if (params.length === 0) throw new Error('one or more parameters required');
        this._params = params;
    }
    get parameters() {
        return this._params;
    }
    parameter(name) {
        const param = this._params.find((p)=>p.name === name);
        if (typeof param === 'undefined') throw new Error(`parameter "${name}" not found`);
        return param.value;
    }
    static fromXml(xmlStr) {
        try {
            const params = [], doc = new Parser(xmlStr).document, nsStack = XmlNamespaceStack.forElement(doc.root);
            if (!doc) throw new Error('not a document');
            if (!nsStack) throw new Error('namespace stack was not initialized');
            let elementNs = nsStack.findNamespace(doc.root.name), elementNameParts = doc.root.name.split(':'), elementName = elementNameParts.length === 1 ? elementNameParts[0] : elementNameParts[1];
            if (!(elementNs === PhaseParameters.namespace.href && elementName === 'data-args')) throw new Error('not a valid phase-parameters message');
            for (const paramElement of doc.root.children){
                if (paramElement.type !== XmlNode.TYPE_ELEMENT) continue;
                let paramElementNs = nsStack.findNamespace(paramElement.name), paramElementNameParts = paramElement.name.split(':'), paramElementName = paramElementNameParts.length === 1 ? paramElementNameParts[0] : paramElementNameParts[1];
                if (!(paramElementNs === PhaseParameters.namespace.href && paramElementName === 'data-arg')) throw new Error('not a param');
                const paramName = paramElement.attributes['name'];
                if (typeof paramName !== 'string') throw new Error('param name must be a string');
                nsStack.push(paramElement);
                let data;
                for (const dataElement of paramElement.children){
                    if (dataElement.type !== XmlNode.TYPE_ELEMENT) continue;
                    try {
                        data = DataValue.fromXmlElement(dataElement, nsStack);
                    } catch (error) {}
                    break;
                }
                nsStack.pop();
                if (!data) throw new Error(`param "${paramName}" does not contain any data`);
                params.push({
                    name: paramName,
                    value: data
                });
            }
            return new PhaseParameters(params);
        } catch (error1) {
            console.error(`[PhaseParameters.read] ${error1}`);
        }
        throw new Error('not a valid phase-parameters message');
    }
    toXml() {
        const attributes = {
            xmlns: PhaseParameters.namespace.href
        }, children = [], params = new XmlElement('data-args', attributes, children), nsStack = new XmlNamespaceStack();
        nsStack.push(params);
        for (const param of this.parameters){
            const data = param.value, paramElement = new XmlElement('data-arg', {
                name: param.name
            }, [
                param.value.toXmlElement(nsStack)
            ]);
            children.push(paramElement);
        }
        nsStack.pop();
        return Writer.elementToString(params);
    }
    toString() {
        let result;
        for (const param of this.parameters){
            result = result ? `${result}, ${param.name}: ${param.value}` : `${param.name}: ${param.value}`;
        }
        return `PhaseParameters(${result})`;
    }
}
// export { DataValue as DataValue, GenericData as GenericData, Json as Json, SemanticData as SemanticData };
// export { Instruction as Instruction, Data as Data, Return as Return, Sequence as Sequence, Goto as Goto, Call as Call, Fault as Fault, Try as Try };
// export { Script as Script };
// export { PhaseParameters as PhaseParameters };
// export const MESSAGE_VERSION = '1.0.0';

const MESSAGE_VERSION = '1.0.0';

// end qworum-messages-*.mjs



/**
 * This class allows web pages to use the functionality that is provided by the Qworum browser extension.
 * The 📝 sign indicates a function that is used for generating Qworum scripts, 
 * and the 🚀 sign is for functions that call the Qworum browser extension. 
 */
class Qworum {
    /**
     * Not used.
     */
    constructor() { }


    /** 
     * Implementation version. 
     * @static
     */
    static version = '1.0.2';

    /** 
     * Qworum message classes. 
     * @static
     */
    static message = {
        GenericData, DataValue, Json, SemanticData,
        Instruction, Data, Return, Sequence, Goto, Call, Fault, Try,
        Script,
        PhaseParameters
    };

    /** 
     * 📝 Builder for Qworum scripts. 
     * @function Qworum.Script
     * @static
     * @param {Qworum.message.Instruction} instruction - The instruction to execute.
     * @returns {Qworum.message.Script}
     * @example
     * const script = Qworum.Script(
     *   Qworum.Sequence(
     *     // Show the user's shopping cart
     *     Qworum.Call(["@", "shopping cart"], "https://shopping-cart.example/view/")
     * 
     *     // Go back to the current e-shop
     *     Qworum.Goto("/home/")
     *   )
     * );
     * @see <https://qworum.net/en/specification/v1/#script>
     */
    static Script = Qworum.message.Script.build;

    /** 
     * 📝 Builder for Call instructions. 
     * @function Qworum.Call
     * @static
     * @param {(string[] | string | null | undefined)} object - The path of the Qworum object to call.
     * @param {(string | null | undefined)} href - The URL of the end-point to call. Can be a relative or absolute URL.
     * @param {(object | object[] | null | undefined)} arguments - Named data value arguments.
     * @param {(object | object[] | null | undefined)} objectArguments - Named Qworum object arguments.
     * @throws {Error}
     * @returns {Qworum.message.Call}
     * @example
     * // Example 1
     * const call1 = Qworum.Call('@', 'home/');
     * // Example 2
     * const call2 = Qworum.Call(
     *   '@', 'home/', 
     *   {name: 'current year', value: Qworum.Json(2022)}
     * );
     * // Example 3
     * const call3 = Qworum.Call(
     *   ['@'], 'home/',
     *   [{name: 'current year', value: Qworum.Json(2022)}],
     *   [{name: , object: ['@', 'a Qworum object']}]
     * );
     * @see <https://qworum.net/en/specification/v1/#call>
     */
    static Call = Qworum.message.Call.build;

    /** Builder function for Return instructions. */

    /** 
     * 📝 Builder for Goto instructions. 
     * @function Qworum.Goto
     * @static
     * @param {(string | null | undefined)} href - The URL of the end-point to call. Can be a relative or absolute URL.
     * @throws {Error}
     * @returns {Qworum.message.Goto}
     * @example
     * const goto = Qworum.Goto(
     *   ['@'], 'home/'
     * );
     * @see <https://qworum.net/en/specification/v1/#goto>
     */
    static Goto = Qworum.message.Goto.build;

    /** 
     * 📝 Builder for Return instructions. 
     * @function Qworum.Return
     * @static
     * @param {(Qworum.message.DataValue | Qworum.message.Instruction)} statement - The instruction or data value to evaluate.
     * @throws {Error}
     * @returns {Qworum.message.Return}
     * @example
     * const return1 = Qworum.Return(Qworum.Json(2022));
     * @see <https://qworum.net/en/specification/v1/#return>
     */
    static Return = Qworum.message.Return.build;

    /** 
     * 📝 Builder for Sequence instructions. 
     * @function Qworum.Sequence
     * @static
     * @param A statement (instruction or data value) or a non-empty array of statements.
     * @throws {Error}
     * @returns {Qworum.message.Sequence}
     * @example
     * const sequence = Qworum.Sequence(Qworum.Json(2022));
     * @see <https://qworum.net/en/specification/v1/#sequence>
     */
    static Sequence = Qworum.message.Sequence.build;

    /** 
     * 📝 Builder for Fault instructions. 
     * @function Qworum.Fault
     * @static
     * @param {(string | undefined)} type - The type of the raised fault.
     * @throws {Error}
     * @returns {Qworum.message.Fault}
     * @example
     * const fault = Qworum.Fault('* the valve is jammed');
     * @see <https://qworum.net/en/specification/v1/#fault>
     */
    static Fault = Qworum.message.Fault.build;

    /** 
     * 📝 Builder function for Try instructions.
     * @function Qworum.Try
     * @static
     * @param statement - A statement (instruction or data value) or a non-empty array of statements.
     * @param catchClauses - One catch clause or an array of catch clauses.
     * @throws {Error}
     * @returns {Qworum.message.Try} 
     * @example
     * const try1 = Qworum.Try(
     *   Qworum.Call('@', 'checkout/'), 
     *   [
     *     {catch: ['* the cart is empty'], Json({})}
     *   ]
     * );
     * @see <https://qworum.net/en/specification/v1/#try>
     */
    static Try = Qworum.message.Try.build;

    /** Builder function for Data instructions. */

    /** 
     * 📝 Builder for Data instructions. 
     * @function Qworum.Data
     * @static
     * @param {string | string[]} path - The path of the data container.
     * @param {(Qworum.message.DataValue | Qworum.message.Instruction | undefined)} statement - An instruction or data value.
     * @throws {Error}
     * @returns {Qworum.message.Data}
     * @example
     * const
     * // Instruction for setting the value of a data container
     * data1 = Qworum.Data('data1', Qworum.Json(2022)),
     * // Instruction for reading the value of the data container
     * data2 = Qworum.Data('data1');
     * @see <https://qworum.net/en/specification/v1/#data>
     */
    static Data = Qworum.message.Data.build;

    /** 
     * 📝 Builder for Json data values. 
     * @function Qworum.Json
     * @static
     * @param value - A value that can be serialized to JSON.
     * @throws {Error}
     * @returns {Qworum.message.Json}
     * @example
     * const json = Qworum.Json(2022);
     * @see <https://qworum.net/en/specification/v1/#json>
     */
    static Json = Qworum.message.Json.build;

    /** Builder function for SemanticData data values. */

    /** 
     * 📝 Builder for semantic data values. 
     * @function Qworum.SemanticData
     * @static
     * @param {string} value - The semantic data value.
     * @param {string | undefined} type - The type of the semantic data value. One of 'json-ld', 'n-quads'.
     * @throws {Error}
     * @returns {Qworum.message.SemanticData}
     * @example
     * const json = Qworum.SemanticData(`{
     *   "@context"  : {"@vocab": "https://schema.org/"},
     *   "@id"       : "https://www.wikidata.org/wiki/Q92760",
     *   "@type"     : "Person",
     *   "givenName" : "Claude",
     *   "familyName": "Shannon",
     *   "birthDate" : "1916-04-30"
     * }`);
     * @see <https://qworum.net/en/specification/v1/#semantic>
     */
    static SemanticData = Qworum.message.SemanticData.build;

    static init() {
        // TODO remove this when the extension's content script can do window.history.forward() reliably
        this._sendMessage(
            { type: '[Web page API v1] in session?' },
            function (response) {
                if (!response.inSession) return;
                window.history.forward();
            }
        );

    }

    /** 
     * 🚀 Checks that the Qworum browser extension is installed and running.
     * @static
     * @async
     * @return {Promise<void>} 
     * @example
     * try{
     *   await Qworum.ping();
     *   console.info('The ping operation was successful.');
     * }catch(error){
     *   console.error('The ping operation was not successful.');
     * }     
     */
    static async ping() {
        try {
            const response = await this._sendMessage({ type: '[Web page API v1] ping' });

            if (response.status !== 200) {
                return Promise.reject(new Error('Internal error'));
            }
            return Promise.resolve(null);
        } catch (error) {
            return Promise.reject(new Error('Writing was not successful'));
        }
    }

    // newValue: {type: 'JSONable', value: someValue} or {type: 'domain-specific', value: {type: 'namespace tag', value: xmlString} }

    /** 
     * 🚀 Sets the value contained in a data container.
     * @static
     * @async
     * @param {string[] | string} path - The path of the data container.
     * @param {Qworum.message.Json | Qworum.message.SemanticData} newValue
     * @return {Promise<Qworum.message.Json | Qworum.message.SemanticData>} - The new value of the data container.
     * @example
     * try{
     *   await Qworum.setData('year', Qworum.Json(2022));
     *   console.info('The write operation was successful.');
     * }catch(error){
     *   console.error('The write operation was not successful.');
     * }     
     * @see <https://qworum.net/en/specification/v1/#data>
     */
    static async setData(path, newValue) {
        this._log(`[setData] `);
        // validate path
        if (typeof path === 'string') path = [path];
        if (!(path instanceof Array && !path.find(e => (typeof e !== 'string')))) {
            return Promise.reject(new Error('Invalid path'));
        }
        // validate newValue
        if (!(
            newValue &&
            [Qworum.message.Json, Qworum.message.SemanticData].find(dataType => (newValue instanceof dataType))
        )) return Promise.reject(new Error('Invalid value'));

        try {
            const response = await this._sendMessage({ 
                type: '[Web page API v1] set data', path, value: newValue.toIndexedDb() 
            });

            if (response.status !== 200) {
                return Promise.reject(new Error('Internal error'));
            }
            return Promise.resolve(newValue);
        } catch (error) {
            return Promise.reject(new Error('Writing was not successful'));
        }
    }

    // TODO add new function: static getMultipleData(paths, callback)?

    /** 
     * 🚀 Reads the value contained in a data container.
     * @static
     * @async
     * @param {string[] | string} path - The path of the data container.
     * @return {Promise<Qworum.message.Json | Qworum.message.SemanticData>} - The value in the data container.
     * @example
     * try{
     *   const result = await Qworum.getData(['a data']);
     *   if (result instanceof Qworum.message.Json){
     *     console.info(`The read operation was successful, the result is: ${JSON.stringify(result.value)}`);
     *   }
     * }catch(error){
     *   console.error('The read operation was not successful.');
     * }
     * @see <https://qworum.net/en/specification/v1/#data>
     */
    static async getData(path) { // TODO replace callbacks with promises?
        this._log(`[getData] `);
        if (typeof path === 'string') path = [path];
        if (!(path instanceof Array && !path.find(e => (typeof e !== 'string')))){
            return Promise.reject(new Error('Invalid path'));
        }

        try {
            const response = await this._sendMessage({ type: '[Web page API v1] get data', path });

            if (response.status === 404) {
                return Promise.resolve(null);
            } else if (response.status !== 200) {
                return Promise.reject(new Error('Internal error'));
            }
    
            let value = null;
            try {
                value = Qworum.message.Json.fromIndexedDb(response.body);
            } catch (error) {
                try {
                    value = Qworum.message.SemanticData.fromIndexedDb(response.body);
                } catch (error) {
                }
            }
            return Promise.resolve(value);
        } catch (error) {
            return Promise.reject(new Error('Internal error occurred'));
        }
    }

    /** 
     * 🚀 Evaluates a Qworum script.
     * @static
     * @async
     * @param {Qworum.message.Script} script
     * @return {Promise<void>}
     * @example
     * try{
     *   await Qworum.eval(Qworum.Script(Qworum.Goto('next-phase/')));
     *   console.info('The eval operation was successful.');
     * }catch(error){
     *   console.error('The eval operation was not successful.');
     * }
     * @see <https://qworum.net/en/specification/v1/#script>
     */
    static async eval(script) { // TODO send script in JSON format, remove XML library from this module
        this._log(`[eval] `);
        if (!script) return Promise.reject(new Error('Invalid script'));

        try {
            const xmlString = script.toXml();
            this._log(`[eval] script: ${xmlString}`);
            const msg = await this._sendMessage({ type: '[Web page API v1] eval xml script', script: xmlString });

            Qworum._log(`[eval] received: ${JSON.stringify(msg)}`);
            if (msg.status !== 200) return Promise.reject(new Error('Internal error occurred'));

            // eval yielded a web request, execute it
            if (msg.body.webRequest) {
                const webRequest = msg.body.webRequest;
                if (webRequest.phaseParameters) {
                    Qworum._log('must make an HTTP(S) POST request, using a form');
                    const
                    XhtmlNamespace = 'http://www.w3.org/1999/xhtml',
                    form = document.createElementNS(XhtmlNamespace, 'form'),
                    // submitButton         = document.createElementNS(XhtmlNamespace, 'input'),
                    phaseParametersInput = document.createElementNS(XhtmlNamespace, 'input');

                    form.setAttribute('id', 'qworum-form');
                    form.setAttribute('name', 'qworum-form');
                    form.method = 'POST';
                    form.action = webRequest.url;
                    // form.setAttribute('method', 'post');
                    // form.setAttribute('action', webRequest.url);

                    // submitButton.setAttribute('type', 'button');
                    // submitButton.setAttribute('id', 'qworum-submit'); // no needed ?
                    // submitButton.setAttribute('name', 'qworum-submit');
                    // submitButton.setAttribute('value', 'submit');
                    // form.appendChild(submitButton);

                    phaseParametersInput.setAttribute('id', 'qworum-phase-parameters'); // not needed?
                    phaseParametersInput.setAttribute('name', 'qworum-phase-parameters');
                    phaseParametersInput.setAttribute('value', webRequest.phaseParameters);
                    phaseParametersInput.setAttribute('type', 'hidden');
                    form.appendChild(phaseParametersInput);

                    document.body.appendChild(form);

                    // alert('sending the POST request ...');
                    form.submit();
                    // document.forms[0].submit();
                    // document.forms['qworum-form'].submit();
                    // document.getElementById('qworum-form').submit();
                } else {
                    Qworum._log('must make an HTTP(S) GET request; redirecting');
                    window.location.replace(webRequest.url);
                }
                // eval terminated the Qworum session normally, inform the end user
            } else {
                // eval terminated the Qworum session normally
                let result;
                if (msg.body.data) {
                    Qworum._log('service worker response is data');
                    for (const DataType of [Qworum.message.Json, Qworum.message.SemanticData]) {
                        try {
                            result = DataType.fromIndexedDb(msg.body.data);
                        } catch (error) { }
                        if (result) break;
                    }
                    if (result) {
                        alert(`The application has terminated normally. Returned data: ${JSON.stringify(result.value)}`);
                        // window.close(); // Scripts may close only the windows that were opened by them.
                    } else {
                        Qworum._log('error: unrecognised data');
                        result = Qworum.Fault('runtime');
                    }
                }

                if (msg.body.fault) {
                    try {
                        result = Qworum.message.Fault.fromIndexedDb(msg.body.fault);
                    } catch (error) {
                        Qworum._log('error: unrecognised fault');
                        result = Qworum.Fault('runtime');
                    }
                    Qworum._log('service worker response is a fault');
                    alert(`The application has terminated with a "${result.type}" fault.`);
                    // window.close(); // Scripts may close only the windows that were opened by them.
                }
            }
        } catch (error) {
            return Promise.reject(new Error('Internal error'));
        }
        return Promise.resolve(null);
    }

    static _sendMessage(message) {
        const browserExtensionInfo = Qworum.getBrowserExtensionInfo();
        this._log(`Detected browser type: ${browserExtensionInfo.browserType}`);
        this._log(`to Qworum extension's service worker: ${JSON.stringify(message)}`);

        return new Promise((resolve, reject) => {
            try {
                if (browserExtensionInfo.browserType === 'chrome') {
                    chrome.runtime.sendMessage(
                        browserExtensionInfo.extensionId,
                        message,
    
                        (response) => {
                            if (!response) {
                                reject(new Error('The Qworum extension is not installed or is disabled.')); return;
                            }
                            resolve(response);
                        }
                    );
                } else {
                    reject(new Error('Unsupported browser.')); return;
                }
            } catch (error) {
                this._log('The Qworum extension is not installed or is disabled.');
                reject(new Error(`${error}`));
            }
        });
    }

    // Returns a non-null value if there is a Qworum extension for this browser.
    // WARNING A non-null value does not mean that 1) the Qworum extension is installed on this browser, or that 2) the browser extension is enabled for this website !!!
    static getBrowserExtensionInfo() {
        // extension ids for all supported browsers
        const 
        isProductionMode = true,
        // isProductionMode = false,
        browserExtensionIds = {
            // The following extension will be published on the Chrome Web Store (https://chrome.google.com/webstore/category/extensions).
            // Browsers that support Chrome Web Store: Google Chrome, Microsoft Edge, Brave, Opera ...
            chrome: isProductionMode ? (
                // available on Chrome Web Store
                'leaofcglebjeebmnmlapbnfbjgfiaokg'
            ) : (
                // local version
                'lmikadfjgkcdcndneebdmkngidngaaab'
            ),
        };

        // extension info for this browser
        let browserExtensionInfo = null, browserType = null;
        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
            // this browser is compatible with Chrome Web Store
            browserType = 'chrome';
            browserExtensionInfo = { browserType, extensionId: browserExtensionIds[browserType] };
        }
        if (!browserExtensionInfo) throw new Error('[Qworum for web pages] Browser not supported by Qworum.');
        return browserExtensionInfo;
    }

    static _log(message) {
        //    console.log(`[Qworum for web pages] ${message}`);
    }
}

// Qworum.init();

export { Qworum };
