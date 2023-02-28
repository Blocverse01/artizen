// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Artizen} from "../Artizen.sol";
import "./console.sol";

contract ArtizenTest {
    Artizen artizen;

    function setUp() public {
        artizen = new Artizen(
            address(0xb0dd3eB2374b21b6efAcf41A16e25Ed8114734E0)
        );
    }

    function testCalculatePercent() public view {
        uint256 amount = 0.1 ether;
        uint256 percent = 70; // 70

        uint256 share = artizen.calculateShare(percent, amount);
        uint256 otherShare = amount - share;
        console.log(share, otherShare);
    }
}
