import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as astring from 'astring';

// Create a custom Acorn plugin
function myPlugin(Parser: typeof acorn.Parser): any {
  return class extends Parser {
    parseLiteral(...args: Parameters<acorn.Parser['parseLiteral']>) {
      const node = super.parseLiteral(...args);
      
      // Check if the literal is a string and if it's wrapped in single quotes
      if (typeof node.value === 'string' && this.input.slice(node.start, node.end).startsWith("'")) {
        const transformed = this.transformMyString(node.value);

        // Replace the Literal node with an ArrayExpression node
        return {
          type: 'SpreadElement',
          argument: {
            type: 'ArrayExpression',
            elements: transformed.map(value => ({
              type: 'Literal',
              value,
              raw: value.toString()
            }))
          },
          start: node.start,
          end: node.end
        };
      }

      return node;
    }

    transformMyString(string: string): number[] {
      const matches = string.match(/\d+!*\d*/g);
      const values: number[] = [];

      matches?.forEach(match => {
        const parts = match.split('!');
        const number = parseInt(parts[0]);
        const times = parts[1] ? parseInt(parts[1]) : 1;

        for (let i = 0; i < times; i++) {
          values.push(number);
        }
      });

      return values;
    }
  };
}

export const MiniLanguage = acorn.Parser.extend(myPlugin);

// Sample code
// const code = `
//   const a = '3!4 5'; // This should become const a = [...[3,3,3,3,5]];
// `;

// Parse the code
// const ast = MiniLanguage.parse(code, { ecmaVersion: 2020 });

// Convert the transformed AST back into source code
// const newCode = astring.generate(ast);

// console.log(newCode);