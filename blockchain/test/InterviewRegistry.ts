import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { keccak256, stringToBytes } from "viem";

const h = (s: string) => keccak256(stringToBytes(s));

describe("InterviewRegistry", async function () {
  const { viem } = await network.create();
  const [owner, relayer, stranger] = await viem.getWalletClients();

  async function deploy() {
    return viem.deployContract("InterviewRegistry", [relayer.account.address]);
  }

  it("records consent before sealing, and seals exactly once", async function () {
    const registry = await deploy();
    const id = h("interview-1");
    await viem.assertions.emit(
      registry.write.recordConsent([id, h("consent")], { account: relayer.account }),
      registry,
      "ConsentRecorded",
    );
    await registry.write.sealInterview([id, h("transcript")], { account: relayer.account });
    const it1 = await registry.read.getInterview([id]);
    assert.equal(it1.transcriptHash, h("transcript"));
    assert.ok(it1.sealedAt > 0n);
    assert.equal(await registry.read.sealedCount(), 1n);
    await viem.assertions.revertWithCustomError(
      registry.write.sealInterview([id, h("tampered")], { account: relayer.account }),
      registry,
      "AlreadySealed",
    );
  });

  it("refuses to seal an interview without recorded consent", async function () {
    const registry = await deploy();
    await viem.assertions.revertWithCustomError(
      registry.write.sealInterview([h("no-consent"), h("t")], { account: relayer.account }),
      registry,
      "NoConsent",
    );
  });

  it("blocks writes from accounts that are neither owner nor writer", async function () {
    const registry = await deploy();
    await viem.assertions.revertWithCustomError(
      registry.write.recordConsent([h("x"), h("c")], { account: stranger.account }),
      registry,
      "NotWriter",
    );
  });

  it("handles withdrawal and blocks sealing afterwards", async function () {
    const registry = await deploy();
    const id = h("interview-2");
    await registry.write.recordConsent([id, h("c")], { account: relayer.account });
    await registry.write.markWithdrawn([id], { account: relayer.account });
    const it2 = await registry.read.getInterview([id]);
    assert.equal(it2.withdrawn, true);
    await viem.assertions.revertWithCustomError(
      registry.write.sealInterview([id, h("t")], { account: relayer.account }),
      registry,
      "AlreadyWithdrawn",
    );
  });

  it("lets the owner (researcher wallet) anchor a report once", async function () {
    const registry = await deploy();
    const r = h("report");
    await registry.write.anchorReport([r, "A07.6"], { account: owner.account });
    assert.ok((await registry.read.reportAnchoredAt([r])) > 0n);
    await viem.assertions.revertWithCustomError(
      registry.write.anchorReport([r, "again"], { account: owner.account }),
      registry,
      "ReportAlreadyAnchored",
    );
  });
});
