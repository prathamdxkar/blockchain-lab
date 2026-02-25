# Exp-5: To Study the Deployment of Chain Code in Hyperledger Fabric

> **Status**: 🔴 Pending — complete the experiment fully before writing this file.
> Refer to `docs/EXP-X_DOC_RULE.md` for all authoring rules.

---

## AIM

<!-- TODO: Copy verbatim from docs/BLOCKCHAIN_LAB_MANUAL.md -->
To study the deployment of chain code in hyper ledger fabric.

---

## THEORY

<!-- TODO: Write 250–300 words (bullet points only, no prose).
     Mandatory web search to verify current versions before writing.
     Cover: Hyperledger Fabric (version 2.5 LTS, year 2018, Linux Foundation),
     permissioned vs permissionless blockchain, chaincode definition and lifecycle
     (package → install → approve → commit → invoke → query),
     channel, MSP (Membership Service Provider), orderer, peer, endorsement policy,
     fabric-contract-api (version), fabric-samples test-network, Docker requirement. -->

---

## IMPLEMENTATION

### CODE

<!-- TODO: Include 3–8 code snippets in logical execution order:
     1. chaincode/javascript/package.json — dependencies (fabric-contract-api, fabric-shim)
     2. chaincode/javascript/index.js — exports MyAssetContract
     3. chaincode/javascript/lib/myAsset.js — MyAssetContract class skeleton (extends Contract)
     4. CreateAsset function body — ctx.stub.putState with JSON serialization
     5. ReadAsset function body — ctx.stub.getState + existence check
     6. GetAllAssets function body — getStateByRange iterator pattern
     7. Shell snippet: fabric test-network commands (up, createChannel, deployCC)
     8. Shell snippet: peer chaincode invoke + peer chaincode query commands
     Refer to docs/EXP-X_DOC_RULE.md §7.1 for snippet rules. -->

---

### OUTPUT

<!-- TODO: Add screenshots saved in Exp-5/screenshots/.
     Minimum required (ALL terminal screenshots — manual capture by user):
       Fig 5.1 — Terminal: ./network.sh up createChannel output (channel created)
       Fig 5.2 — Terminal: peer lifecycle chaincode install output (package ID visible)
       Fig 5.3 — Terminal: peer chaincode invoke (CreateAsset) — status 200 response
       Fig 5.4 — Terminal: peer chaincode query (ReadAsset/GetAllAssets) — JSON response
     Follow naming: fig-5.Y-description.png (kebab-case, no spaces).
     Refer to docs/EXP-X_DOC_RULE.md §7.2 and §10.2 for screenshot rules.
     ⚠️ This experiment has NO browser screenshots — all outputs are terminal-based. -->

---

## LAB OUTCOMES

<!-- TODO: Copy verbatim from docs/BLOCKCHAIN_LAB_MANUAL.md -->
**LO5** — Write and deploy chain code in Hyperledger Fabric.

---

## CONCLUSION

<!-- TODO: Write exactly 2–3 sentences.
     Mandatory opener: "We have successfully..."
     Mention: MyAssetContract chaincode, Hyperledger Fabric, fabric-contract-api, LO5 achieved.
     No bullet points. Refer to docs/EXP-X_DOC_RULE.md §9. -->
