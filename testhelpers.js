import chai from "chai";
import jsxChai from "jsx-chai";
chai.use(jsxChai);
if(typeof window !== undefined){
    window.expect = chai.expect;
}
global.expect = chai.expect;
