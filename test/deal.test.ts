import { assert } from "chai";
import { Contract } from "ethers";

import { deal } from "../src/helpers";

import { useEnvironment } from "./helpers";

const user = "0x7Ef4174aFdF4514F556439fa2822212278151Db6";
const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const aave = "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9";
const crv = "0xd533a949740bb3306d119cc777fa900ba034cd52";
const cbETH = "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704";
const maDai = "0x36F8d0D0573ae92326827C4a82Fe4CE4C244cAb6";

describe("Integration tests examples", function () {
  useEnvironment();

  it("Should add dealSlots to the config", function () {
    assert.equal(
      this.hre.config.dealSlots["0x5f98805a4e8be255a32880fdec7f6728c6568ba0"],
      2,
      "LUSD"
    );
    assert.equal(
      this.hre.config.dealSlots["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
      4,
      "WETH override"
    );
    assert.equal(this.hre.config.dealSlots[aave], 0, "AAVE");
    assert.equal(this.hre.config.dealSlots[usdc], 9, "USDC");
    assert.equal(this.hre.config.dealSlots[crv], undefined, "CRV");
  });

  it("Should deal USDC", async function () {
    await deal(usdc, user, 1);

    assert.equal(
      await new Contract(
        usdc,
        ["function balanceOf(address) external view returns (uint256)"],
        this.hre.ethers.provider
      ).balanceOf(user),
      1,
      "balanceOf"
    );
  });

  it("Should deal cbETH & re-use cache", async function () {
    await deal(cbETH, user, 1);

    assert.equal(
      await new Contract(
        cbETH,
        ["function balanceOf(address) external view returns (uint256)"],
        this.hre.ethers.provider
      ).balanceOf(user),
      1,
      "balanceOf1"
    );

    await deal(cbETH, user, 2);

    assert.equal(
      await new Contract(
        cbETH,
        ["function balanceOf(address) external view returns (uint256)"],
        this.hre.ethers.provider
      ).balanceOf(user),
      2,
      "balanceOf2"
    );
  });

  it("Should deal maDAI", async function () {
    await deal(maDai, user, 1);

    assert.equal(
      await new Contract(
        maDai,
        ["function balanceOf(address) external view returns (uint256)"],
        this.hre.ethers.provider
      ).balanceOf(user),
      1,
      "balanceOf"
    );
  });
});
