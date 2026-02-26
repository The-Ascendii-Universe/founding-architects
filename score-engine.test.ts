import { expect } from "chai";
import { deployAll } from "./utils/fixtures";

describe("ScoreEngine", () => {
  let fx: Awaited<ReturnType<typeof deployAll>>;

  beforeEach(async () => {
    fx = await deployAll();
  });

  it("only registry can add score", async () => {
    await expect(
      fx.score.connect(fx.other).addScore(fx.participant.address, 10)
    ).to.be.revertedWithCustomError(fx.score, "ScoreEngine__Unauthorized");
  });

  it("registry can add score", async () => {
    await fx.score.connect(fx.registry).addScore(fx.participant.address, 10);
    expect(await fx.score.getScore(fx.participant.address)).to.equal(10);
  });

  it("score accumulates correctly", async () => {
    await fx.score.connect(fx.registry).addScore(fx.participant.address, 10);
    await fx.score.connect(fx.registry).addScore(fx.participant.address, 5);
    expect(await fx.score.getScore(fx.participant.address)).to.equal(15);
  });
});
