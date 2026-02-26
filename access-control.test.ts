import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { deployAll } from "./utils/fixtures";

describe("AccessControl", () => {
  let fx: Awaited<ReturnType<typeof deployAll>>;

  beforeEach(async () => {
    fx = await deployAll();
  });

  it("assigns baseline roles correctly", async () => {
    expect(await fx.access.hasRole(fx.ROLE_ADMIN, fx.admin.address)).to.equal(true);
    expect(await fx.access.hasRole(fx.ROLE_GOVERNOR, fx.governor.address)).to.equal(true);
    expect(await fx.access.hasRole(fx.ROLE_ORACLE, fx.oracle.address)).to.equal(true);
    expect(await fx.access.hasRole(fx.ROLE_PARTICIPANT, fx.participant.address)).to.equal(true);
    expect(await fx.access.hasRole(fx.ROLE_BENEFACTOR, fx.benefactor.address)).to.equal(true);
  });

  it("prevents unauthorized role assignment", async () => {
    await expect(
      fx.access.connect(fx.other).grantRole(fx.ROLE_GOVERNOR, fx.other.address)
    ).to.be.revertedWithCustomError(fx.access, "AccessControlUnauthorizedAccount");
  });

  it("allows admin to grant and revoke roles", async () => {
    await fx.access.grantRole(fx.ROLE_ORACLE, fx.other.address);
    expect(await fx.access.hasRole(fx.ROLE_ORACLE, fx.other.address)).to.equal(true);

    await fx.access.revokeRole(fx.ROLE_ORACLE, fx.other.address);
    expect(await fx.access.hasRole(fx.ROLE_ORACLE, fx.other.address)).to.equal(false);
  });

  it("only admin can authorize upgrades", async () => {
    const NewImpl = await ethers.getContractFactory("SIBAccessControl");
    await expect(
      upgrades.upgradeProxy(fx.access.address, NewImpl.connect(fx.other))
    ).to.be.revertedWithCustomError(fx.access, "AccessControlUnauthorizedAccount");

    await upgrades.upgradeProxy(fx.access.address, NewImpl.connect(fx.admin));
  });
});
