export function snakeToCamel(str: string) {
    return str.toLowerCase().replace(/([-_][a-z])/g, 
        group => group
        .toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );
}

export function camelToSnake(str: string) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

export function snakeToCamelFields(fields: string[]) {
    return fields.map((field) => snakeToCamel(field));
}

export function camelToSnakeFields(fields: string[]) {
    return fields.map((field) => camelToSnake(field));
}