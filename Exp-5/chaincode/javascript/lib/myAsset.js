'use strict';

const { Contract } = require('fabric-contract-api');

/**
 * MyAssetContract — Simple Asset Management Chaincode
 * Hyperledger Fabric JavaScript Chaincode
 * University of Mumbai · Blockchain Lab · Exp-5
 */
class MyAssetContract extends Contract {

  /**
   * InitLedger — Populate ledger with sample assets during network init.
   * @param {Context} ctx - The transaction context.
   */
  async InitLedger(ctx) {
    const assets = [
      {
        ID: 'asset1',
        Color: 'blue',
        Size: 5,
        Owner: 'Tomoko',
        AppraisedValue: 300,
      },
      {
        ID: 'asset2',
        Color: 'red',
        Size: 5,
        Owner: 'Brad',
        AppraisedValue: 400,
      },
      {
        ID: 'asset3',
        Color: 'green',
        Size: 10,
        Owner: 'Jin Soo',
        AppraisedValue: 500,
      },
      {
        ID: 'asset4',
        Color: 'yellow',
        Size: 10,
        Owner: 'Max',
        AppraisedValue: 600,
      },
      {
        ID: 'asset5',
        Color: 'black',
        Size: 15,
        Owner: 'Adriana',
        AppraisedValue: 700,
      },
      {
        ID: 'asset6',
        Color: 'white',
        Size: 15,
        Owner: 'Michel',
        AppraisedValue: 800,
      },
    ];

    for (const asset of assets) {
      asset.docType = 'asset';
      await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
      console.info(`Asset ${asset.ID} initialized`);
    }
  }

  /**
   * CreateAsset — Add a new asset to the world state.
   * @param {Context} ctx
   * @param {string} id - Asset ID (must be unique)
   * @param {string} color - Asset color
   * @param {number} size - Asset size
   * @param {string} owner - Asset owner
   * @param {number} appraisedValue - Appraised value
   */
  async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
    const exists = await this.AssetExists(ctx, id);
    if (exists) {
      throw new Error(`The asset ${id} already exists`);
    }

    const asset = {
      ID: id,
      Color: color,
      Size: parseInt(size),
      Owner: owner,
      AppraisedValue: parseInt(appraisedValue),
    };

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    return JSON.stringify(asset);
  }

  /**
   * ReadAsset — Retrieve an asset by ID.
   * @param {Context} ctx
   * @param {string} id
   */
  async ReadAsset(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  /**
   * UpdateAsset — Update the properties of an existing asset.
   * @param {Context} ctx
   * @param {string} id
   * @param {string} color
   * @param {number} size
   * @param {string} owner
   * @param {number} appraisedValue
   */
  async UpdateAsset(ctx, id, color, size, owner, appraisedValue) {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }

    const updatedAsset = {
      ID: id,
      Color: color,
      Size: parseInt(size),
      Owner: owner,
      AppraisedValue: parseInt(appraisedValue),
    };

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
    return JSON.stringify(updatedAsset);
  }

  /**
   * DeleteAsset — Remove an asset from the world state.
   * @param {Context} ctx
   * @param {string} id
   */
  async DeleteAsset(ctx, id) {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    await ctx.stub.deleteState(id);
  }

  /**
   * AssetExists — Check if an asset with the given ID exists.
   * @param {Context} ctx
   * @param {string} id
   * @returns {boolean}
   */
  async AssetExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  /**
   * TransferAsset — Transfer asset ownership.
   * @param {Context} ctx
   * @param {string} id
   * @param {string} newOwner
   * @returns {string} - Old owner name
   */
  async TransferAsset(ctx, id, newOwner) {
    const assetString = await this.ReadAsset(ctx, id);
    const asset = JSON.parse(assetString);
    const oldOwner = asset.Owner;
    asset.Owner = newOwner;
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    return oldOwner;
  }

  /**
   * GetAllAssets — Retrieve all assets in the world state.
   * @param {Context} ctx
   * @returns {string} JSON array of all assets
   */
  async GetAllAssets(ctx) {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange('', '');
    let result = await iterator.next();

    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }

    return JSON.stringify(allResults);
  }
}

module.exports = { MyAssetContract };
