const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { getBigNumber } = require("./utilities");

describe("Sqrt", function () {

    before(async function () {
        const SqrtContract = await ethers.getContractFactory("SqrtMock");
        Sqrt = await SqrtContract.deploy();
    });

    // Input values
    var arr_input = ['0x2', '0x4', '0x10', '0x100', '0x10000', '0x100000000',
                    '0x10000000000000000', '0x100000000000000000000000000000000',
                    '0x10000000000000000000000000000000000000000000000000000000000000000'];
    // Expected values
    var arr_out = ['0x1', '0x2', '0x4', '0x10', '0x100', '0x10000', '0x100000000',
                    '0x10000000000000000', '0x100000000000000000000000000000000'];
    var arr_out_minus1 = ['0x1', '0x1', '0x3', '0xf', '0xff', '0xffff', '0xffffffff',
                            '0xffffffffffffffff', '0xffffffffffffffffffffffffffffffff'];

    it("Sqrt.checkSqrt() returns correct values", async function () {
        expect((await Sqrt.checkSqrt(0)).eq(0));
        for (var i = 0; i < 8; i += 1) {
            var testInput = BigNumber.from(arr_input[i]);
            var expectedValue = BigNumber.from(arr_out[i]);
            var expectedValueMinus1 = BigNumber.from(arr_out_minus1[i]);

            // 2^(2^i) - 1
            var calculatedValueMinus1 = await Sqrt.checkSqrt(testInput.add(-1));
            await expect(calculatedValueMinus1).eq(expectedValueMinus1);

            // 2 ^(2^i)
            var calculatedValue = await Sqrt.checkSqrt(testInput);

            await expect(calculatedValue).eq(expectedValue);
            // 2 ^(2^i) + 1
            var calculatedValuePlus1 = await Sqrt.checkSqrt(testInput.add(1));
            await expect(calculatedValuePlus1).eq(expectedValue);
        }
        var maxTestInput = BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        var calculatedValue = await Sqrt.checkSqrt(maxTestInput)
        expect(calculatedValue).eq(arr_out_minus1[8]);
    });
  });

