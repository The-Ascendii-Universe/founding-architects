import { expect } from "chai";
import { ethers } from "hardhat";
import { deployAll } from "./utils/fixtures";

describe("BenefactorVault", () => {
  let fx: Awaited<ReturnType<typeof deployAll>>;

  beforeEach(async () => {
    fx = await deployAll();
  });

  it("only benefactors can deposit", async () => {
    await expect(
      fx.vault.connect(fx.other).deposit({ value: ethers.parseEther("1") })
    ).to.be.revertedWithCustomError(fx.vault, "BenefactorVault__NotBenefactor");
  });

  it("benefactor can deposit successfully", async () => {
    await fx.vault.connect(fx.benefactor).deposit({ value: ethers.parseEther("1") });
    expect(await ethers.provider.getBalance(fx.vault.address)).to.equal(ethers.parseEther("1"));
  });

  it("only governor can withdraw", async () => {
    await fx.vault.connect(fx.benefactor).deposit({ value: ethers.parseEther("1") });

    await expect(
      fx.vault.connect(fx.other).withdraw(fx.admin.address, ethers.parseEther("1"))
    ).to.be.revertedWithCustomError(fx.vault, "BenefactorVault__Unauthorized");

    await fx.vault.connect(fx.governor).withdraw(fx.admin.address, ethers.parseEther("1"));
  });
});
