var pjson = require("./package.json");
let banner = `
┏┳┓         ┏┓┏┓┏┓
 ┃ ┏┓┏┓┏┓┏  ┃┃┗┓┃ 
 ┻ ┗┛┣┛┗┛┛  ┗┛┗┛┗┛
     ┛            
             ${pjson.version}\n`;
function greet() {
  console.log(banner);
}

module.exports = {
  greet: greet,
};
