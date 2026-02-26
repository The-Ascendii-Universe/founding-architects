import { expect } from "chai";
import { deployAll } from "./utils/fixtures";

describe("CeremonyRegistry", () => {
  let fx: Awaited<ReturnType<typeof deployAll>>;

  beforeEach(async () => {
    fx = await deployAll();
  });

  it("only oracle can record completions", async () => {
    await expect(
      fx.registry.connect(fx.other).recordCompletion(fx.participant.address, 1)
    ).to.be.revertedWithCustomError(fx.registry, "CeremonyRegistry__NotOracle");
  });

  it("oracle can record a ritual completion", async () => {
    await fx.registry.connect(fx.oracle).recordCompletion(fx.participant.address, 1);
    const completed = await fx.registry.hasCompleted(fx.participant.address, 1);
    expect(completed).to.equal(true);
  });

  it("records completion triggers score update", async () => {
    await fx.registry.connect(fx.oracle).recordCompletion(fx.participant.address, 1);
    const score = await fx.score.getScore(fx.participant.address);
    expect(score).to.be.greaterThan(0);
  });
});
