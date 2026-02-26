import { expect } from "chai";
import { deployAll } from "./utils/fixtures";

describe("SIBCore – Constants & Invariants", () => {
  let fx: Awaited<ReturnType<typeof deployAll>>;

  beforeEach(async () => {
    fx = await deployAll();
  });

  it("stores AccessControl address correctly", async () => {
    expect(await fx.core.accessControl()).to.equal(fx.access.address);
  });

  it("rejects calls from unauthorized accounts", async () => {
    await expect(
      fx.core.connect(fx.other).setGlobalParameter(1, 999)
    ).to.be.revertedWithCustomError(fx.core, "SIBCore__Unauthorized");
  });

  it("allows governor to update parameters", async () => {
    await fx.core.connect(fx.governor).setGlobalParameter(1, 123);
    expect(await fx.core.globalParameters(1)).to.equal(123);
  });
});
