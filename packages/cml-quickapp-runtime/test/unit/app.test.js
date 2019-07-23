import "../global/index";
import chai from "chai";
import * as mock from "../mock/app/options";
import { resolveTestOutput } from "../build/util";
const expect = chai.expect;
const cmlPath = resolveTestOutput("index", "quickapp");

const _case = mock.case1
const input = _case.get('in')
const shouldOut = _case.get('out')

const { createApp } = require(cmlPath).default;
const app = createApp(input);
const actualOut = app.getOptions();

describe("createApp", function() {
  describe("transform options", function() {
    it(`should data return equal`, function() {
      expect(actualOut["data"]).to.deep.equal(shouldOut["data"]);
    });

    Object.keys(shouldOut).forEach(function(key) {
      it(`should has ${key} property`, function() {
        expect(actualOut[key]).to.not.equal(undefined);
      });

      let type = typeof actualOut[key];
      it(`should ${key} value type is ${type}`, function() {
        expect(type).to.equal(typeof shouldOut[key]);
      });
    });

    it("should return an object", function() {
      expect(app).to.be.a("object");
    });

    it('should return app.cmlType is quickapp', function() {
      expect(app.cmlType).to.equal("quickapp");
    });
  });

  describe("runtime widgets", function() {
    describe("onLaunch", function() {
      const onLaunch = actualOut.onLaunch.bind(__CML__GLOBAL.App);
      onLaunch({
        scene: "1001",
        referinfo: {}
      });
    });
    describe("onHide", function() {
      const onHide = actualOut.onHide.bind(__CML__GLOBAL.App);
      onHide();
    });
  });
});
